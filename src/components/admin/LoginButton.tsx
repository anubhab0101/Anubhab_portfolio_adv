"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });

    if (error) {
      setLoading(false);
      window.alert(error.message);
    }
  }

  return (
    <button className="admin-button primary" type="button" onClick={signIn} disabled={loading}>
      {loading ? "Opening Google..." : "Sign in with Google"}
    </button>
  );
}
