import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-6 shadow-soft">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted">Optional — the sampler works without an account.</p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-lg border border-border bg-elevated px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link to="/" className="block text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
          Back to sampler
        </Link>
      </div>
    </main>
  );
}
