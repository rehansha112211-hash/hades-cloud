"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, ShieldCheck, KeyRound, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("none");
  const [paymentConfigured, setPaymentConfigured] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getSettings();
      if (!alive) return;
      if (res.ok) {
        setSupportEmail(res.data.settings.supportEmail);
        setDiscordUrl(res.data.settings.discordUrl);
        setContactPhone(res.data.settings.contactPhone);
        setPaymentProvider(res.data.payment.provider);
        setPaymentConfigured(res.data.payment.configured);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await api.updateSettings({
      supportEmail,
      discordUrl,
      contactPhone,
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error(res.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Public site settings */}
      <form onSubmit={onSave} className="glass-card rounded-xl p-6">
        <h3 className="font-display font-bold text-base mb-1">
          Public site settings
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          These values are surfaced on the public contact section.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="set-email" className="text-xs uppercase tracking-wider">
              Support email
            </Label>
            <Input
              id="set-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@hadescloud.local"
              maxLength={120}
              className="bg-foreground/5 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-discord" className="text-xs uppercase tracking-wider">
              Discord invite URL
            </Label>
            <Input
              id="set-discord"
              value={discordUrl}
              onChange={(e) => setDiscordUrl(e.target.value)}
              placeholder="https://discord.gg/your-invite"
              maxLength={200}
              className="bg-foreground/5 border-border"
            />
            <p className="text-[11px] text-muted-foreground">
              Leave empty to hide the Discord button on the public site.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-phone" className="text-xs uppercase tracking-wider">
              Contact phone
            </Label>
            <Input
              id="set-phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              maxLength={40}
              className="bg-foreground/5 border-border"
            />
          </div>
        </div>

        <div className="flex justify-end pt-5 mt-5 border-t border-border/40">
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary text-primary-foreground"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="size-4" /> Save changes
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Integration status */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display font-bold text-base mb-1">
          Integration status
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Real-time view of which integrations are wired up. Secret credentials
          are stored only in environment variables, never in the database.
        </p>

        <div className="space-y-3">
          <IntegrationRow
            icon={ShieldCheck}
            label="Admin authentication"
            detail="NextAuth credentials · bcrypt hashing · server-side protected routes"
            status="active"
          />
          <IntegrationRow
            icon={KeyRound}
            label="AUTH_SECRET"
            detail="Loaded from environment variable"
            status="active"
          />
          <IntegrationRow
            icon={CreditCard}
            label="Payment gateway"
            detail={
              paymentProvider === "none"
                ? "Not configured — set PAYMENT_PROVIDER and payment keys in .env"
                : `Provider: ${paymentProvider} · ${
                    paymentConfigured
                      ? "credentials detected"
                      : "credentials missing"
                  }`
            }
            status={
              paymentProvider === "none"
                ? "pending"
                : paymentConfigured
                ? "active"
                : "warning"
            }
          />
        </div>
      </div>

      {/* Secret credentials reminder */}
      <div className="rounded-xl border border-amber/30 bg-amber/5 p-5">
        <div className="flex items-start gap-3">
          <KeyRound className="size-5 text-amber shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-sm text-amber mb-1">
              Secret credentials
            </h4>
            <p className="text-xs text-amber/80 leading-relaxed">
              All secret credentials (DATABASE_URL, AUTH_SECRET, PAYMENT_SECRET,
              RAZORPAY_KEY_SECRET, STRIPE_SECRET_KEY) live only in environment
              variables. They are never read by the public site, never exposed
              through any API response, and never written to the database. To
              rotate or change them, edit your server environment and restart
              the app — no code changes required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationRow({
  icon: Icon,
  label,
  detail,
  status,
}: {
  icon: typeof ShieldCheck;
  label: string;
  detail: string;
  status: "active" | "pending" | "warning";
}) {
  const tone =
    status === "active"
      ? "text-primary bg-primary/10 border-primary/30"
      : status === "warning"
      ? "text-amber bg-amber/10 border-amber/30"
      : "text-muted-foreground bg-foreground/5 border-border";
  const dot =
    status === "active"
      ? "bg-primary"
      : status === "warning"
      ? "bg-amber"
      : "bg-muted-foreground";
  const statusLabel =
    status === "active" ? "Active" : status === "warning" ? "Action needed" : "Pending";

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
      <div
        className={cn(
          "size-9 rounded-lg border flex items-center justify-center shrink-0",
          tone
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
      </div>
      <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border", tone)}>
        <span className={cn("size-1.5 rounded-full", dot)} />
        {statusLabel}
      </span>
    </div>
  );
}
