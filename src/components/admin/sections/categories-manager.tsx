"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type Category } from "@/lib/api/client";
import { toast } from "sonner";

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const refresh = async () => {
    const res = await api.getCategories();
    if (res.ok) setCategories(res.data.categories);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const onEdit = (c: Category) => {
    setEditing(c);
    setFormOpen(true);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    const res = await api.deleteCategory(deleteTarget.id);
    if (res.ok) {
      toast.success("Category deleted");
      setCategories((arr) => arr.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </h3>
          <p className="text-xs text-muted-foreground">
            New categories appear automatically in the plan form.
          </p>
        </div>
        <Button onClick={onAdd} className="bg-primary text-primary-foreground glow-emerald">
          <Plus className="size-4" />
          Create Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="size-12 rounded-lg bg-foreground/5 mx-auto mb-3 flex items-center justify-center">
            <Tags className="size-5 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-base mb-1">
            No categories yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first category to start organizing plans.
          </p>
          <Button onClick={onAdd}>
            <Plus className="size-4" /> Create first category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="glass-card rounded-xl p-4 hover-lift hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-display font-bold tracking-wide">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    /{c.slug}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-foreground/5 border border-border text-muted-foreground">
                  {c.planCount ?? 0} plans
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(c)}
                  className="flex-1 h-8"
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteTarget(c)}
                  className="h-8 text-redstone border-redstone/30 hover:bg-redstone/5"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editing}
        onSaved={() => {
          setFormOpen(false);
          refresh();
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? If any plans use this category, the delete will be blocked and
              you'll be asked to reassign them first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CategoryFormModal({
  open,
  onClose,
  category,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setError(null);
    }
  }, [open, category]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setSaving(true);
    const res = category
      ? await api.updateCategory(category.id, name.trim())
      : await api.createCategory(name.trim());
    setSaving(false);
    if (res.ok) {
      toast.success(category ? "Category updated" : "Category created");
      onSaved();
    } else {
      setError(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit category" : "Create category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Category Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="OBSIDIAN"
              maxLength={60}
              autoFocus
              className="bg-foreground/5 border-border"
            />
            {error && <p className="text-xs text-redstone">{error}</p>}
            <p className="text-[11px] text-muted-foreground">
              Slug will be auto-generated from the name.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground"
            >
              {saving ? "Saving..." : category ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
