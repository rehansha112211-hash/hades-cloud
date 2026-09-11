"use client";

import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { api } from "@/lib/api/client";

type Faq = { id: string; question: string; answer: string };

const FALLBACK_FAQS: Faq[] = [
  {
    id: "f1",
    question: "What is Minecraft hosting?",
    answer:
      "Minecraft hosting is a remote server you rent so you and your friends can play Minecraft together 24/7 — without anyone needing to keep their personal computer online or run the server software locally. We host the server in a data center on high-performance hardware and you manage it through a web control panel.",
  },
  {
    id: "f2",
    question: "How quickly is my server deployed?",
    answer:
      "Most servers are provisioned automatically within a few minutes of successful payment. During high-demand windows or for custom configurations, deployment may take a little longer — but you will always receive a confirmation once the server is ready.",
  },
  {
    id: "f3",
    question: "What storage do you use?",
    answer:
      "All plans use NVMe SSD storage, which offers dramatically faster read and write speeds than traditional SATA SSDs or hard drives. This translates to faster chunk loading, smoother world saves and better overall responsiveness for your players.",
  },
  {
    id: "f4",
    question: "Can I upgrade my plan?",
    answer:
      "Yes — you can upgrade or downgrade at any time from your customer dashboard. Upgrades are prorated based on the remaining time in your billing cycle, and the new resource allocation is applied to your server after a short restart.",
  },
  {
    id: "f5",
    question: "How does billing work?",
    answer:
      "Billing is recurring on the duration you select at checkout — monthly, quarterly, semi-annually or annually. You can cancel future renewals at any time and your server will continue running until the end of the current paid period.",
  },
  {
    id: "f6",
    question: "Do you provide DDoS protection?",
    answer:
      "Yes. All Hades Cloud servers sit behind network-level DDoS protection designed to absorb and mitigate common attack vectors targeting Minecraft servers. Protection is included with every plan at no additional cost.",
  },
  {
    id: "f7",
    question: "How can I contact support?",
    answer:
      "You can reach our team through the contact form on this website or via our community Discord. Most tickets are answered within a few hours during business days; urgent infrastructure issues are monitored around the clock.",
  },
];

export function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getPublicFaqs();
      if (!alive) return;
      if (res.ok && res.data.faqs.length > 0) {
        setFaqs(res.data.faqs);
      } else {
        setFaqs(FALLBACK_FAQS);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="faq" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionEyebrow>FAQ</SectionEyebrow>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 leading-tight">
            Questions, <span className="text-gradient-hades">answered.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Everything you need to know about hosting with Hades Cloud.
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={100}>
          {faqs === null ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl h-16 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
              defaultValue="item-0"
            >
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.id}
                  value={`item-${i}`}
                  className="glass-card rounded-xl px-5 border-border/40 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-5 group">
                    <span className="flex items-center gap-3 text-left">
                      <HelpCircle className="size-4 text-primary shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        {f.question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Reveal>
      </div>
    </section>
  );
}
