"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="auth-panel">
      <section className="auth-card">
        <h1>Admin action failed</h1>
        <p>{error.message || "The admin request could not be completed."}</p>
        <div className="error-actions">
          <button className="admin-button primary" type="button" onClick={reset}>
            Try again
          </button>
          <a className="admin-button" href="/admin">
            Back to admin
          </a>
        </div>
      </section>
    </main>
  );
}
