import { createClient } from "@supabase/supabase-js";
import { getServiceSupabaseEnv } from "@/lib/env";

export function createSupabaseServiceClient() {
  const { url, key } = getServiceSupabaseEnv();

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
