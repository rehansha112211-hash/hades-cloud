"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LEGAL_PAGES = [
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "refund", label: "Refund Policy" },
];

export function LegalManager() {
  const [active, setActive] = useState("terms");
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/legal");
        const data = await res.json();
        if (alive && data.legal) {
          setContents(data.legal);
        }
      } catch {
        // ignore
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contents),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Legal content saved — website updated!");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeLegal = LEGAL_PAGES.find((p) => p.key === active);

  return (
    <div className="space-y-5">
      {/* Tab selector */}
      <div className="flex gap-2 flex-wrap">
        {LEGAL_PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              active === p.key
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-foreground/5 text-muted-foreground border border-border hover:bg-foreground/10"
            )}
          >
            <FileText className="size-4 inline mr-1.5" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base">{activeLegal?.label}</h3>
          <Button onClick={onSave} disabled={saving} size="sm" className="bg-primary text-primary-foreground">
            {saving ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : <><Save className="size-4" /> Save</>}
          </Button>
        </div>
        <Textarea
          value={contents[active] || ""}
          onChange={(e) => setContents({ ...contents, [active]: e.target.value })}
          rows={20}
          className="bg-foreground/5 border-border font-mono text-sm resize-none"
          placeholder={"Enter " + activeLegal?.label + " content here..."}
        />
        <p className="text-xs text-muted-foreground mt-3">
          Use # for headings, ## for subheadings, - for bullet points. Content is saved to the database and shown on the website immediately.
        </p>
      </div>
    </div>
  );
}
