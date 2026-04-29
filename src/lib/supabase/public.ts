import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv, hasPublicSupabaseEnv } from "@/lib/env";

export function createPublicSupabaseClient() {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const { url, key } = getPublicSupabaseEnv();

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
