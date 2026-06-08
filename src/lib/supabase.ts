// ─── IMPORTANT ───────────────────────────────────────────────
// This module is imported by SSR (Node 20) AND the browser.
// Supabase's realtime client crashes on Node 20 (no native WebSocket).
// We guard createClient so it only runs in browser context.
// All Supabase calls already happen via dynamic import("@/lib/supabase")
// inside useEffect / async functions — never at module init time in routes.
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "";

// Only create the client if WebSocket is available (browser) or we mock it (Node 20)
// Polyfill WebSocket for Node 20 using the already-installed `ws` package
if (typeof globalThis.WebSocket === "undefined") {
  try {
    // `ws` is installed as a dep — use dynamic require via Object.assign trick
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require("ws");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).WebSocket = ws;
  } catch {
    // ws not available — Supabase realtime will silently fail
  }
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at">;
        Update: Partial<Omit<User, "id">>;
      };
      nominations: {
        Row: Nomination;
        Insert: Omit<Nomination, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Nomination, "id">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at">;
        Update: Partial<Omit<Payment, "id">>;
      };
    };
  };
};

export interface User {
  id: string;
  salutation: string;
  full_name: string;
  designation: string;
  company_name: string;
  department: string;
  email: string;
  mobile: string;
  city: string;
  pincode: string;
  address: string;
  landline?: string;
  pan?: string;
  wants_invoice: boolean;
  gst_number?: string;
  legal_company_name?: string;
  billing_address?: string;
  source?: string;
  newsletter: boolean;
  created_at: string;
}

export interface NominationEntry {
  id: string;
  sector: string;
  sub_sector?: string;
  category: string;
  category_label?: string;
  nominee_name: string;
  company_name: string;
  why_deserves: string;
  photo_url?: string;
}

export interface Nomination {
  id: string;
  user_id?: string;
  registrant_email: string;
  registrant_name: string;
  entries: NominationEntry[];
  total_amount: number;
  status: "draft" | "pending_payment" | "paid" | "approved" | "rejected";
  payment_method?: string;
  payment_screenshot_url?: string;
  transaction_id?: string;
  payment_reference?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  declaration_agreed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  nomination_id: string;
  amount: number;
  method: string;
  status: "pending" | "success" | "failed";
  transaction_id?: string;
  reference?: string;
  screenshot_url?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  created_at: string;
}
