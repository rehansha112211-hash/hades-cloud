"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { api, type AdminPlan, type Category } from "@/lib/api/client";
import { formatPrice } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PlansManager() {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = async () => {
    const [plansRes, catsRes] = await Promise.all([
      api.getAdminPlans(),
      api.getCategories(),
    ]);
    if (plansRes.ok) setPlans(plansRes.data.plans);
    if (catsRes.ok) setCategories(catsRes.data.categories);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const onEdit = (plan: AdminPlan) => {
    setEditing(plan);
    setFormOpen(true);
  };

  const onToggleVisibility = async (plan: AdminPlan) => {
    const next = !plan.isVisible;
    // Optimistic
    setPlans((arr) =>
      arr.map((p) => (p.id === plan.id ? { ...p, isVisible: next } : p))
    );
    const res = await api.togglePlanVisibility(plan.id, next);
    if (res.ok) {
      toast.success(`Plan ${next ? "shown" : "hidden"}`);
      setPlans((arr) =>
        arr.map((p) => (p.id === plan.id ? res.data.plan : p))
      );
    } else {
      toast.error(res.error);
      setPlans((arr) =>
        arr.map((p) => (p.id === plan.id ? { ...p, isVisible: !next } : p))
      );
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await api.deletePlan(deleteTarget.id);
    setDeleting(false);
    if (res.ok) {
      toast.success("Plan deleted");
      setPlans((arr) => arr.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      toast.error(res.error);
    }
  };

  const filtered = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="pl-9 bg-foreground/5 border-border"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {plans.length} total · {plans.filter((p) => p.isVisible).length}{" "}
            visible
          </span>
          <Button onClick={onAdd} className="bg-primary text-primary-foreground glow-emerald">
            <Plus className="size-4" />
            Add New Plan
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {plans.length === 0 && (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="size-12 rounded-lg bg-foreground/5 mx-auto mb-3 flex items-center justify-center">
            <AlertCircle className="size-5 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-base mb-1">
            No plans yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first hosting plan to display on the public website.
          </p>
          <Button onClick={onAdd}>
            <Plus className="size-4" /> Add first plan
          </Button>
        </div>
      )}

      {/* Plans table — desktop */}
      {plans.length > 0 && (
        <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-foreground/[0.03] border-b border-border/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">RAM</th>
                <th className="px-4 py-3 font-medium">Storage</th>
                <th className="px-4 py-3 font-medium">CPU</th>
                <th className="px-4 py-3 font-medium">Visibility</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-border/30 last:border-0 hover:bg-foreground/[0.02]"
                >
                  <td className="px-4 py-3 font-medium">{plan.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {plan.category}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatPrice(plan.price)}
                  </td>
                  <td className="px-4 py-3">{plan.ram}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {plan.storage} {plan.storageType}
                  </td>
                  <td className="px-4 py-3">{plan.cpu}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium",
                        plan.isVisible
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {plan.isVisible ? (
                        <>
                          <Eye className="size-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3" /> Hidden
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        onClick={() => onEdit(plan)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </IconButton>
                      <IconButton
                        onClick={() => onToggleVisibility(plan)}
                        title={plan.isVisible ? "Hide" : "Show"}
                      >
                        {plan.isVisible ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteTarget(plan)}
                        title="Delete"
                        tone="danger"
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Plans cards — mobile */}
      {plans.length > 0 && (
        <div className="lg:hidden space-y-3">
          {filtered.map((plan) => (
            <div key={plan.id} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold">{plan.name}</h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium",
                        plan.isVisible
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {plan.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {plan.category} · {formatPrice(plan.price)} /{" "}
                    {plan.duration.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <Spec label="RAM" value={plan.ram} />
                <Spec label="Storage" value={`${plan.storage} ${plan.storageType}`} />
                <Spec label="CPU" value={plan.cpu} />
                <Spec label="Processor" value={plan.processor} />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(plan)}
                  className="flex-1"
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleVisibility(plan)}
                  className="flex-1"
                >
                  {plan.isVisible ? (
                    <>
                      <EyeOff className="size-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" /> Show
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteTarget(plan)}
                  className="text-redstone border-redstone/30 hover:bg-redstone/5"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan form modal */}
      <PlanFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        plan={editing}
        categories={categories}
        onSaved={() => {
          setFormOpen(false);
          refresh();
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              . This action cannot be undone. If you only want to remove the
              plan from the public website, hide it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete plan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-md border transition-colors",
        tone === "danger"
          ? "border-redstone/30 text-redstone hover:bg-redstone/10"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      )}
    >
      {children}
    </button>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-foreground/[0.03] rounded p-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs font-medium">{value}</p>
    </div>
  );
}

// =====================================================
// Plan create / edit form
// =====================================================
function PlanFormModal({
  open,
  onClose,
  plan,
  categories,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  plan: AdminPlan | null;
  categories: Category[];
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 Month");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [storageType, setStorageType] = useState("NVMe");
  const [cpu, setCpu] = useState("");
  const [processor, setProcessor] = useState("");
  const [planType, setPlanType] = useState("performance");
  const [isVisible, setIsVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    if (plan) {
      setName(plan.name);
      setCategoryId(plan.categoryId);
      setPrice(String(plan.price));
      setDuration(plan.duration);
      setRam(plan.ram);
      setStorage(plan.storage);
      setStorageType(plan.storageType);
      setCpu(plan.cpu);
      setProcessor(plan.processor);
      setPlanType((plan as AdminPlan & { planType?: string }).planType || "performance");
      setIsVisible(plan.isVisible);
    } else {
      setName("");
      setCategoryId(categories[0]?.id ?? "");
      setPrice("");
      setDuration("1 Month");
      setRam("");
      setStorage("");
      setStorageType("NVMe");
      setCpu("");
      setProcessor("");
      setPlanType("performance");
      setIsVisible(true);
    }
    setErrors({});
  }, [open, plan, categories]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Plan name is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) newErrors.price = "Enter a valid price";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!ram.trim()) newErrors.ram = "RAM is required";
    if (!storage.trim()) newErrors.storage = "Storage is required";
    if (!storageType.trim()) newErrors.storageType = "Storage type is required";
    if (!cpu.trim()) newErrors.cpu = "CPU is required";
    if (!processor.trim()) newErrors.processor = "Processor is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      categoryId,
      price: priceNum,
      duration: duration.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      storageType: storageType.trim(),
      cpu: cpu.trim(),
      processor: processor.trim(),
      planType,
      isVisible,
    };
    const res = plan
      ? await api.updatePlan(plan.id, payload)
      : await api.createPlan(payload);
    setSaving(false);
    if (res.ok) {
      toast.success(plan ? "Plan updated" : "Plan created");
      onSaved();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{plan ? "Edit plan" : "Add new plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Plan Name" error={errors.name} required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="DIAMOND"
                maxLength={80}
                className="bg-foreground/5 border-border"
              />
            </Field>

            <Field label="Category" error={errors.categoryId} required>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-foreground/5 border-border">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Price (₹)" error={errors.price} required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="149"
                className="bg-foreground/5 border-border"
              />
            </Field>

            <Field label="Duration" error={errors.duration} required>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-foreground/5 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="12 Months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="RAM" error={errors.ram} required>
              <Input
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="8 GB"
                maxLength={40}
                className="bg-foreground/5 border-border"
              />
            </Field>

            <Field label="Storage" error={errors.storage} required>
              <Input
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="180 GB"
                maxLength={40}
                className="bg-foreground/5 border-border"
              />
            </Field>

            <Field label="Storage Type" error={errors.storageType} required>
              <Select value={storageType} onValueChange={setStorageType}>
                <SelectTrigger className="bg-foreground/5 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NVMe">NVMe</SelectItem>
                  <SelectItem value="SSD">SSD</SelectItem>
                  <SelectItem value="HDD">HDD</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Plan Type" required>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger className="bg-foreground/5 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="bot">Bot Hosting</SelectItem>
                  <SelectItem value="vps">VPS</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="CPU / vCPU" error={errors.cpu} required>
              <Input
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                placeholder="6 vCPU"
                maxLength={40}
                className="bg-foreground/5 border-border"
              />
            </Field>

            <Field
              label="Processor"
              error={errors.processor}
              required
              className="sm:col-span-2"
            >
              <Input
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="AMD Ryzen 9"
                maxLength={80}
                className="bg-foreground/5 border-border"
              />
            </Field>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              <span>Visible on public website</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
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
                "Save Plan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && <span className="text-redstone">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-redstone">{error}</p>}
    </div>
  );
}
