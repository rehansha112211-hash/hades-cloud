"use client";

import { useState } from "react";
import { Mail, MessageCircle, Send, Loader2, CheckCircle2, Headset, Clock, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const res = await api.submitContact({ name, email, message });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      toast.success("Message sent! We'll be in touch shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 80% 20%, oklch(0.74 0.18 145 / 0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — copy + support info */}
          <Reveal>
            <SectionEyebrow>Contact / Support</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
              Talk to a human.
              <br />
              <span className="text-gradient-hades">Anytime.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
              Got a question before signing up? Need help with an existing
              server? Our team is here to help — and we actually know Minecraft.
            </p>

            <div className="mt-8 space-y-4">
              <ContactMethod
                icon={Headset}
                title="Support tickets"
                detail="Average first response under 2 hours"
                accent="emerald"
              />
              <ContactMethod
                icon={Clock}
                title="24/7 monitoring"
                detail="Infrastructure monitored around the clock"
                accent="amber"
              />
              <ContactMethod
                icon={LifeBuoy}
                title="Community"
                detail="Join our community Discord for quick questions"
                accent="emerald"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => toast.info("Discord link coming soon — ask us via the form!")}
                className="bg-foreground/5 border-border"
              >
                <MessageCircle className="size-4" />
                Join Discord
              </Button>
              <a
                href="mailto:support@hadescloud.local"
                className="inline-flex items-center gap-2 h-9 px-3 text-sm rounded-md border border-border bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <Mail className="size-4" />
                support@hadescloud.local
              </a>
            </div>
          </Reveal>

          {/* Right — contact form */}
          <Reveal delay={150}>
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              {done ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl mb-2">
                    Message sent
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Thanks for reaching out. Our team will respond within one
                    business day.
                  </p>
                  <Button variant="outline" onClick={() => setDone(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-xs uppercase tracking-wider">
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      maxLength={120}
                      className="bg-foreground/5 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-xs uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      maxLength={254}
                      className="bg-foreground/5 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-xs uppercase tracking-wider">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      required
                      maxLength={2000}
                      rows={5}
                      className="bg-foreground/5 border-border resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald h-11"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" /> Send message
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    We'll only use this info to respond to your message.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactMethod({
  icon: Icon,
  title,
  detail,
  accent,
}: {
  icon: typeof Headset;
  title: string;
  detail: string;
  accent: "emerald" | "amber";
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={
          accent === "emerald"
            ? "size-10 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center shrink-0"
            : "size-10 rounded-lg bg-accent/10 border border-accent/30 text-accent flex items-center justify-center shrink-0"
        }
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
