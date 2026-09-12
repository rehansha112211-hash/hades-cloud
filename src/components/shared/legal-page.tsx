"use client";

import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/shared/site-layout";
import { Loader2 } from "lucide-react";

export function LegalPage({ slug, title }: { slug: string; title: string }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/legal/" + slug);
        const data = await res.json();
        if (alive) setContent(data.content || "Content not available.");
      } catch {
        if (alive) setContent("Failed to load content. Please try again later.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  return (
    <SiteLayout activePage={"/" + slug}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8 animate-fade-in-up">
          {title}
        </h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return <h2 key={i} className="font-display font-bold text-xl text-foreground mt-8 mb-3">{line.replace("# ", "")}</h2>;
              }
              if (line.startsWith("## ")) {
                return <h3 key={i} className="font-display font-bold text-lg text-foreground mt-6 mb-2">{line.replace("## ", "")}</h3>;
              }
              if (line.startsWith("- ")) {
                return <li key={i} className="text-sm text-muted-foreground ml-6 mb-1 list-disc">{line.replace("- ", "")}</li>;
              }
              if (line.trim() === "") {
                return <div key={i} className="h-3" />;
              }
              return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">{line}</p>;
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
