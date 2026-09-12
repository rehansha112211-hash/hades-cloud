import type { Plan, Category } from "@prisma/client";

/**
 * Flatten a Prisma Plan row (with its Category relation) into the plain shape
 * expected by the HADES CLOUD frontend. The frontend uses `category` as a
 * string (the category name), never as a nested object.
 */
export function flattenPlan(
  plan: Plan & { category: Category }
) {
  return {
    id: plan.id,
    name: plan.name,
    categoryId: plan.categoryId,
    category: plan.category.name,
    price: plan.price,
    duration: plan.duration,
    ram: plan.ram,
    storage: plan.storage,
    storageType: plan.storageType,
    cpu: plan.cpu,
    processor: plan.processor,
    planType: (plan as { planType?: string }).planType || "performance",
    isVisible: plan.isVisible,
    sortOrder: plan.sortOrder,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

export type FlattenedPlan = ReturnType<typeof flattenPlan>;
