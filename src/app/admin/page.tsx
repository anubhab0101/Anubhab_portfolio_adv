import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LoginButton } from "@/components/admin/LoginButton";
import { adminEmail } from "@/lib/env";
import { getAdminSession } from "@/lib/auth";
import { getAdminPortfolioData } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

function SetupRequired() {
  return (
    <main className="auth-panel">
      <section className="auth-card">
        <h1>Supabase setup required</h1>
        <p>
          Add the variables from <code>.env.example</code>, configure Google Auth in Supabase, run the migration in
          <code> supabase/migrations</code>, then restart the dev server.
        </p>
      </section>
    </main>
  );
}

function SignedOut() {
  return (
    <main className="auth-panel">
      <section className="auth-card">
        <h1>Admin login</h1>
        <p>Only {adminEmail} can access this dashboard. Sign in with the matching Google account.</p>
        <LoginButton />
      </section>
    </main>
  );
}

function Forbidden({ email }: { email: string }) {
  return (
    <main className="auth-panel">
      <section className="auth-card">
        <h1>Access denied</h1>
        <p>
          You are signed in as {email}, but this admin panel is restricted to {adminEmail}.
        </p>
      </section>
    </main>
  );
}

export default async function AdminPage() {
  const session = await getAdminSession();

  if (session.status === "not_configured") {
    return <SetupRequired />;
  }

  if (session.status === "signed_out") {
    return <SignedOut />;
  }

  if (session.status === "forbidden") {
    return <Forbidden email={session.user.email || "unknown email"} />;
  }

  const data = await getAdminPortfolioData();

  return (
    <div className="admin-page">
      <AdminDashboard data={data} adminEmail={adminEmail} signedInEmail={session.user.email || ""} />
    </div>
  );
}
