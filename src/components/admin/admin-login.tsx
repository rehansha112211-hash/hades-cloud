"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ParticleField } from "@/components/brand/particle-field";
import { useNav } from "@/stores/nav-store";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export function AdminLogin() {
  const { goPublic, goAdmin } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, jump straight to the dashboard
  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.checkSession();
      if (!alive) return;
      if (res.ok && res.data.authenticated) {
        goAdmin();
      }
    })();
    return () => {
      alive = false;
    };
  }, [goAdmin]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (!res || res.error) {
        setError("Invalid email or password. Please try again.");
        toast.error("Login failed");
      } else {
        toast.success("Welcome back!");
        goAdmin();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-hades-hero px-4 py-12">
      {/* Dark space background (starfield handled globally) */}
      <div className="absolute inset-0 z-0 bg-hades-hero" />
      <div className="absolute inset-0 bg-pixel-grid opacity-20" />

      <ParticleField count={20} />

      {/* Back to site */}
      <button
        type="button"
        onClick={goPublic}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <ArrowLeft className="size-4" />
        Back to site
      </button>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex">
            <BrandLogo size={48} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight mt-6">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Secure access to the Hades Cloud control panel
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-redstone/30 bg-redstone/5 p-3 text-sm text-redstone">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-xs uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                maxLength={254}
                placeholder="admin@hadescloud.local"
                className="bg-foreground/5 border-border h-11"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-xs uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  maxLength={128}
                  placeholder="••••••••"
                  className="bg-foreground/5 border-border h-11 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary shrink-0 mt-0.5" />
              <p>
                Protected by rate limiting and bcrypt password hashing. All
                admin actions are authenticated server-side. Unauthorized
                sessions are redirected here.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Default seed:{" "}
          <code className="font-mono text-foreground/80">admin@hadescloud.local</code>{" "}
          /{" "}
          <code className="font-mono text-foreground/80">hadescloud123</code>
          <br />
          Change credentials after first login.
        </p>
      </div>
    </div>
  );
}
