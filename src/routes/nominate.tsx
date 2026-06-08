import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { GoldParticles } from "@/components/site/GoldParticles";
import { Step1Registration, type RegistrationData } from "@/components/nomination/Step1Registration";
import { Step2Categories, type EntryForm } from "@/components/nomination/Step2Categories";
import { Step3Payment, type PaymentData } from "@/components/nomination/Step3Payment";
import { ReviewSummary } from "@/components/nomination/ReviewSummary";
import { NominationSuccess } from "@/components/nomination/NominationSuccess";
import { calcTotal } from "@/lib/nomination-data";
import { useAutoSave } from "@/hooks/useAutoSave";
import { finaliseSubmission } from "@/lib/nomination-service";
import { toast, Toaster } from "sonner";
import { User, LayoutGrid, CreditCard, Check } from "lucide-react";

export const Route = createFileRoute("/nominate")({
  head: () => ({
    meta: [
      { title: "Submit Nomination — BCS Ratna Award 2026" },
      { name: "description", content: "Submit your nomination for India's most prestigious broadcasting and media award." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Submit Nomination — BCS Ratna Award 2026" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://bcsratnaaward.com/nominate" }],
  }),
  component: NominatePage,
});

type Step = 1 | 2 | 3;
const STEPS = [
  { id: 1, icon: User, label: "Registration" },
  { id: 2, icon: LayoutGrid, label: "Categories" },
  { id: 3, icon: CreditCard, label: "Payment" },
] as const;

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

function NominatePage() {
  const [step, setStep] = useState<Step>(1);
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [entries, setEntries] = useState<EntryForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Auto-save state — localStorage only accessible client-side
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");

  // Edit-target for navigating back from ReviewSummary → Step2
  const [step2EditTarget, setStep2EditTarget] = useState<
    { sectorId?: string; entryKey?: string } | undefined
  >(undefined);

  // Session restore: on mount, read sessionStorage (client-only) + fetch draft
  useEffect(() => {
    // sessionStorage only available client-side — safe inside useEffect
    const storedId = typeof window !== "undefined"
      ? localStorage.getItem("nominationDraftId")
      : null;

    if (!storedId) return;

    // Restore the draftId into state
    setDraftId(storedId);

    (async () => {
      const localDraftRaw = typeof window !== "undefined"
        ? localStorage.getItem("nominationDraftData")
        : null;
      let localDraft: { draftId: string | null; registration: RegistrationData; entries: EntryForm[] } | null = null;
      if (localDraftRaw) {
        try {
          localDraft = JSON.parse(localDraftRaw);
        } catch {
          localDraft = null;
        }
      }

      if (!storedId && localDraft) {
        setDraftId(localDraft.draftId ?? null);
        setRegistration(localDraft.registration);
        setEntries(localDraft.entries);
        toast.success("Restored your previous draft locally.");
        return;
      }

      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("nominations")
          .select("entries, registrant_name, registrant_email, user_id")
          .eq("id", storedId)
          .eq("status", "draft")
          .single();

        if (error || !data) {
          if (localDraft) {
            setDraftId(localDraft.draftId ?? null);
            setRegistration(localDraft.registration);
            setEntries(localDraft.entries);
            toast.success("Restored your previous draft locally.");
            return;
          }
          localStorage.removeItem("nominationDraftId");
          setDraftId(null);
          toast.warning("Couldn't load your previous draft — starting fresh.");
          return;
        }

        if (data.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("salutation, full_name, designation, company_name, department, email, mobile, city, pincode, address, pan, wants_invoice, gst_number, legal_company_name, billing_address, newsletter")
            .eq("id", data.user_id)
            .single();
          if (userData) {
            setRegistration({
              salutation: userData.salutation ?? "",
              full_name: userData.full_name ?? "",
              designation: userData.designation ?? "",
              company_name: userData.company_name ?? "",
              department: userData.department ?? "",
              email: userData.email ?? "",
              mobile: userData.mobile ?? "",
              city: userData.city ?? "",
              pincode: userData.pincode ?? "",
              pan: userData.pan ?? "",
              address: userData.address ?? "",
              wants_invoice: userData.wants_invoice ?? false,
              gst_number: userData.gst_number ?? "",
              legal_company_name: userData.legal_company_name ?? "",
              billing_address: userData.billing_address ?? "",
              newsletter: userData.newsletter ?? false,
            });
          }
        }

        // Restore entries (DB entries don't have photo_file — set to null)
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          const restored: EntryForm[] = data.entries.map((e: Record<string, unknown>) => ({
            id: (e.id as string) ?? crypto.randomUUID(),
            sector: (e.sector as string) ?? "",
            sub_sector: (e.sub_sector as string) ?? "",
            category: (e.category as string) ?? "",
            category_label: (e.category_label as string) ?? "",
            nominee_name: (e.nominee_name as string) ?? "",
            company_name: (e.company_name as string) ?? "",
            why_deserves: (e.why_deserves as string) ?? "",
            photo_file: null,
            photo_name: (e.photo_url as string) ? ((e.photo_url as string).split("/").pop() ?? "") : "",
          }));
          setEntries(restored);
          toast.success("Previous draft restored.");
        }
      } catch {
        localStorage.removeItem("nominationDraftId");
        setDraftId(null);
        toast.warning("Couldn't load your previous draft — starting fresh.");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear editTarget once Step 2 has mounted with the target
  useEffect(() => {
    if (step === 2 && step2EditTarget) {
      const timer = setTimeout(() => setStep2EditTarget(undefined), 500);
      return () => clearTimeout(timer);
    }
  }, [step, step2EditTarget]);

  // Wire auto-save hook
  const { retry: retryAutoSave } = useAutoSave(
    draftId,
    registration,
    entries,
    (id) => setDraftId(id),
    setAutoSaveStatus
  );

  function goToStep(s: Step) {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep2WithTarget(target: { sectorId?: string; entryKey?: string }) {
    setStep2EditTarget(target);
    goToStep(2);
  }

  async function handleStep3Submit(payment: PaymentData) {
    if (!draftId) {
      toast.error("No draft found. Please go back and save your selections.");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = await finaliseSubmission(draftId, entries, payment);
      sessionStorage.removeItem("nominationDraftId");
      setNominationId(id);
      setIsDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Save draft manually (triggered from Step 3 "Save Draft" button)
  async function handleSaveDraft() {
    toast.info("Saving draft…");
    const success = await retryAutoSave();
    if (success) {
      toast.success("Draft synced to server.");
    } else {
      toast.error("Draft saved locally. It will retry automatically when the network is back.");
    }
  }

  useEffect(() => {
    if (step === 3 && registration && entries.length > 0) {
      retryAutoSave();
    }
  }, [step, registration, entries, retryAutoSave]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Toaster position="top-right" theme="dark" richColors />

      {/* ── Hero ── */}
      <section className="relative pt-[70px] md:pt-[148px] pb-10 overflow-hidden">
        <GoldParticles count={20} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.12),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-cinzel text-xs text-[#C9A84C] mb-3 tracking-widest">BCS Ratna Award 2026</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient">
            Submit Your Nomination
          </h1>
          <div className="gold-divider" />
          <p className="text-white/70 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            India's most prestigious broadcasting & media award. Nominate across 6 sectors and 80+ categories in a single submission.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        {isDone && nominationId && registration ? (
          <NominationSuccess
            nominationId={nominationId}
            registrantName={registration.full_name}
            entriesCount={entries.length}
            totalAmount={calcTotal(entries.length)}
          />
        ) : (
          <>
            {/* ── Step Indicator ── */}
            <div className="flex items-center mb-10 px-2">
              {STEPS.map((s, idx) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${done ? "bg-[#C9A84C] border-[#C9A84C]" : active ? "border-[#C9A84C] bg-[#C9A84C]/12" : "border-white/12 bg-transparent"}`}>
                        {done
                          ? <Check size={16} className="text-black" strokeWidth={3} />
                          : <s.icon size={16} className={active ? "text-[#C9A84C]" : "text-white/25"} />
                        }
                      </div>
                      <span className={`text-xs font-cinzel hidden sm:block tracking-wide transition-colors
                        ${active ? "text-[#C9A84C]" : done ? "text-white/50" : "text-white/20"}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-[2px] mx-3 rounded-full transition-all duration-500
                        ${step > s.id ? "bg-[#C9A84C]" : "bg-white/8"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* ── Step Header ── */}
            <div className="mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                {step === 1 && "Personal & Company Information"}
                {step === 2 && "Select Award Categories"}
                {step === 3 && "Review & Payment"}
              </h2>
              <p className="text-white/60 text-sm md:text-base mt-2 leading-relaxed">
                {step === 1 && "Fields marked * are mandatory"}
                {step === 2 && "Select one or multiple categories across any sector — all in one submission"}
                {step === 3 && "Review your nominations, then complete secure payment"}
              </p>
            </div>

            {/* ── Step Content ── */}
            {step === 1 && (
              <Step1Registration
                initialData={registration ?? undefined}
                onNext={(data) => { setRegistration(data); goToStep(2); }}
              />
            )}

            {step === 2 && (
              <Step2Categories
                initialEntries={entries}
                onBack={() => goToStep(1)}
                onNext={(e) => { setEntries(e); goToStep(3); }}
                autoSaveStatus={autoSaveStatus}
                onRetryAutoSave={retryAutoSave}
                editTarget={step2EditTarget}
              />
            )}

            {step === 3 && registration && (
              <div className="space-y-8">
                {/* Review Summary — shown above payment */}
                <ReviewSummary
                  entries={entries}
                  onEditDetails={() => goToStep(2)}
                  onEditSector={(sectorId) => goToStep2WithTarget({ sectorId })}
                  onAddMore={() => goToStep(2)}
                />

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <p className="text-white/30 text-xs font-cinzel px-3">Complete Payment</p>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                {/* Payment form */}
                <Step3Payment
                  entries={entries}
                  registrantName={registration.full_name}
                  registrantEmail={registration.email}
                  registrantMobile={registration.mobile}
                  onBack={() => goToStep(2)}
                  onSubmit={handleStep3Submit}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
