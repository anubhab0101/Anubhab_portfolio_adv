import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { adminEmail, hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession =
  | { status: "not_configured"; user: null; isAdmin: false }
  | { status: "signed_out"; user: null; isAdmin: false }
  | { status: "forbidden"; user: User; isAdmin: false }
  | { status: "authorized"; user: User; isAdmin: true };

export async function getAdminSession(): Promise<AdminSession> {
  if (!hasPublicSupabaseEnv() || !hasServiceSupabaseEnv()) {
    return { status: "not_configured", user: null, isAdmin: false };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { status: "signed_out", user: null, isAdmin: false };
  }

  const email = user.email?.trim().toLowerCase();
  if (email !== adminEmail) {
    return { status: "forbidden", user, isAdmin: false };
  }

  return { status: "authorized", user, isAdmin: true };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (session.status === "not_configured") {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  if (session.status !== "authorized") {
    redirect("/admin");
  }

  return session.user;
}
