import { useEffect, useRef, useCallback } from "react";
import type { RegistrationData } from "@/components/nomination/Step1Registration";
import type { EntryForm } from "@/components/nomination/Step2Categories";
import { upsertDraft } from "@/lib/nomination-service";

const LOCAL_DRAFT_KEY = "nominationDraftData";

type LocalDraftPayload = {
  draftId: string | null;
  registration: RegistrationData;
  entries: EntryForm[];
};

function saveLocalDraft(draftId: string | null, registration: RegistrationData, entries: EntryForm[]) {
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify({ draftId, registration, entries }));
  } catch {
    // ignore local storage write issues
  }
}

/**
 * Debounced auto-save hook for nomination drafts.
 *
 * Watches `entries` for changes and schedules a debounced save after `delayMs`.
 * Uses refs for all callback dependencies to avoid stale closures and
 * prevent unnecessary re-renders.
 *
 * @returns `{ retry }` — call to immediately trigger a save without debounce.
 */
export function useAutoSave(
  draftId: string | null,
  registration: RegistrationData | null,
  entries: EntryForm[],
  onSave: (id: string) => void,
  onStatusChange: (s: "saving" | "saved" | "error") => void,
  delayMs: number = 2000,
): { retry: () => Promise<boolean> } {
  // Timer ref — avoids re-renders when the timer changes
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for the latest values of all arguments — avoids stale closures
  const draftIdRef = useRef(draftId);
  const registrationRef = useRef(registration);
  const entriesRef = useRef(entries);
  const onSaveRef = useRef(onSave);
  const onStatusChangeRef = useRef(onStatusChange);
  const errorRef = useRef(false);

  // Keep refs in sync with the latest prop values on every render
  draftIdRef.current = draftId;
  registrationRef.current = registration;
  entriesRef.current = entries;
  onSaveRef.current = onSave;
  onStatusChangeRef.current = onStatusChange;

  // Core save logic — reads from refs so it's always up-to-date
  const executeSave = useCallback(async (): Promise<boolean> => {
    const currentRegistration = registrationRef.current;
    const currentEntries = entriesRef.current;
    const currentDraftId = draftIdRef.current;

    if (!currentRegistration) return false;

    saveLocalDraft(currentDraftId, currentRegistration, currentEntries);
    onStatusChangeRef.current("saving");
    try {
      const id = await upsertDraft(currentDraftId, currentRegistration, currentEntries);
      onSaveRef.current(id);
      onStatusChangeRef.current("saved");
      localStorage.setItem("nominationDraftId", id);
      saveLocalDraft(id, currentRegistration, currentEntries);
      errorRef.current = false;
      return true;
    } catch (error) {
      console.error("Draft save failed:", error);
      errorRef.current = true;
      onStatusChangeRef.current("error");
      return false;
    }
  }, []); // stable — all values come from refs

  // Debounce effect: fires whenever registration or entries change
  useEffect(() => {
    if (!registrationRef.current) return;

    // Clear any pending timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Schedule a new save
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      executeSave();
    }, delayMs);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registration, entries]); // watch for registration or entries changes

  useEffect(() => {
    const onOnline = () => {
      if (errorRef.current && navigator.onLine) {
        executeSave();
      }
    };

    const interval = window.setInterval(() => {
      if (errorRef.current && navigator.onLine) {
        executeSave();
      }
    }, 15000);

    window.addEventListener("online", onOnline);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
    };
  }, [executeSave]);

  // retry — immediate save, bypasses debounce
  const retry = useCallback(async () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return executeSave();
  }, [executeSave]);

  return { retry };
}
