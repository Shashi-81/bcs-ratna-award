import type { RegistrationData } from "@/components/nomination/Step1Registration";
import type { EntryForm } from "@/components/nomination/Step2Categories";
import type { PaymentData } from "@/components/nomination/Step3Payment";
import { supabase } from "@/lib/supabase";
import type { NominationEntry } from "@/lib/supabase";
import { calcTotal } from "@/lib/nomination-data";

// ── Helpers ────────────────────────────────────────────────────

/** Extract file extension (without dot), defaulting to "bin". */
function fileExt(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "bin";
}

/** Serialise EntryForm[] → NominationEntry[], stripping photo_file. */
function toDbEntries(entries: EntryForm[]): NominationEntry[] {
  return entries.map((e) => ({
    id: e.id,
    sector: e.sector,
    sub_sector: e.sub_sector || undefined,
    category: e.category,
    category_label: e.category_label,
    nominee_name: e.nominee_name,
    company_name: e.company_name,
    why_deserves: e.why_deserves,
    // photo_url intentionally omitted here; set after upload in finaliseSubmission
  }));
}

// ── upsertDraft ────────────────────────────────────────────────

/**
 * Creates or updates a draft nomination row.
 *
 * @param draftId  Existing nomination id, or null for first save.
 * @param registration  Step-1 registrant data.
 * @param entries  Step-2 entry forms.
 * @returns  The upserted nomination id.
 */
export async function upsertDraft(
  draftId: string | null,
  registration: RegistrationData,
  entries: EntryForm[],
): Promise<string> {
  // 1. Upsert the users row (conflict on email)
  const { data: userData, error: userError } = await supabase
    .from("users")
    .upsert(
      {
        salutation: registration.salutation,
        full_name: registration.full_name,
        designation: registration.designation,
        company_name: registration.company_name,
        department: registration.department,
        email: registration.email,
        mobile: registration.mobile,
        city: registration.city,
        pincode: registration.pincode,
        address: registration.address,
        pan: registration.pan || null,
        wants_invoice: registration.wants_invoice,
        gst_number: registration.gst_number || null,
        legal_company_name: registration.legal_company_name || null,
        billing_address: registration.billing_address || null,
        newsletter: registration.newsletter,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (userError) throw new Error(`Failed to upsert user: ${userError.message}`);
  const user_id: string = userData.id;

  // 2. Serialise entries
  const dbEntries = toDbEntries(entries);
  const total_amount = calcTotal(entries.length);

  // 3. Upsert the nominations row (conflict on id)
  const { data: nomData, error: nomError } = await supabase
    .from("nominations")
    .upsert(
      {
        ...(draftId ? { id: draftId } : {}),
        user_id,
        registrant_email: registration.email,
        registrant_name: `${registration.salutation} ${registration.full_name}`.trim(),
        entries: dbEntries,
        total_amount,
        status: "draft",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id")
    .single();

  if (nomError) throw new Error(`Failed to upsert nomination: ${nomError.message}`);

  return nomData.id as string;
}

// ── finaliseSubmission ─────────────────────────────────────────

/**
 * Uploads files and finalises a nomination for submission.
 *
 * @param draftId  The nomination id returned by upsertDraft.
 * @param entries  Step-2 entry forms (may carry photo_file).
 * @param payment  Step-3 payment data.
 * @returns  The nomination id.
 */
export async function finaliseSubmission(
  draftId: string,
  entries: EntryForm[],
  payment: PaymentData,
): Promise<string> {
  // 1. Serialise entries (text fields only to start)
  const dbEntries: (NominationEntry & { category_label?: string })[] = toDbEntries(entries);

  // 2. Upload each entry's passport photo, if provided
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry.photo_file) continue;

    const ext = fileExt(entry.photo_file);
    const path = `${draftId}/entry-${i}-photo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("nomination-files")
      .upload(path, entry.photo_file, { upsert: true });

    if (uploadError) {
      console.warn(`Photo upload failed for entry ${i}: ${uploadError.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("nomination-files")
      .getPublicUrl(path);

    if (urlData?.publicUrl) {
      dbEntries[i] = { ...dbEntries[i], photo_url: urlData.publicUrl };
    }
  }

  // 3. Upload payment screenshot, if provided
  let payment_screenshot_url: string | undefined;
  if (payment.screenshot_file) {
    const ext = fileExt(payment.screenshot_file);
    const path = `${draftId}/payment-proof.${ext}`;

    const { error: ssError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, payment.screenshot_file, { upsert: true });

    if (!ssError) {
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(path);
      payment_screenshot_url = urlData?.publicUrl;
    } else {
      console.warn(`Screenshot upload failed: ${ssError.message}`);
    }
  }

  // 4. Determine final status
  const status =
    payment.method === "razorpay" ? "paid" : "pending_payment";

  // 5. Update the nominations row
  const { data: nomData, error: nomError } = await supabase
    .from("nominations")
    .update({
      status,
      payment_method: payment.method,
      transaction_id: payment.transaction_id || null,
      payment_reference: payment.payment_reference || null,
      razorpay_payment_id: payment.razorpay_payment_id || null,
      razorpay_order_id: payment.razorpay_order_id || null,
      declaration_agreed: true,
      entries: dbEntries,
      ...(payment_screenshot_url
        ? { payment_screenshot_url }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId)
    .select("id")
    .single();

  if (nomError) throw new Error(`Failed to finalise nomination: ${nomError.message}`);

  return nomData.id as string;
}
