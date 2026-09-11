/**
 * Typed API client for the HADES CLOUD frontend.
 * All calls use relative paths (so they work behind Caddy/preview gateways).
 */

export type PublicPlan = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  ram: string;
  storage: string;
  storageType: string;
  cpu: string;
  processor: string;
};

export type AdminPlan = PublicPlan & {
  isVisible: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  planCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string; phone?: string | null };
  plan: { name: string; duration: string; category: string } | null;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  orderCount: number;
  lastOrder: {
    orderNumber: string;
    status: string;
    amount: number;
    createdAt: string;
  } | null;
  createdAt: string;
};

export type AdminStats = {
  totalPlans: number;
  visiblePlans: number;
  hiddenPlans: number;
  totalOrders: number;
  totalCustomers: number;
  pendingPaymentOrders: number;
  paidOrders: number;
  revenue: number;
};

async function http<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "include",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        ok: false,
        status: res.status,
        error: body?.error ?? `Request failed (${res.status})`,
      };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export const api = {
  async getPublicPlans() {
    return http<{ plans: PublicPlan[] }>("/api/public/plans");
  },
  async getPublicFaqs() {
    return http<{
      faqs: { id: string; question: string; answer: string }[];
    }>("/api/public/faqs");
  },
  async createOrder(payload: {
    planId: string;
    customer: { name: string; email: string; phone?: string };
    customerNote?: string;
  }) {
    return http<{
      order: {
        id: string;
        orderNumber: string;
        amount: number;
        status: string;
        createdAt: string;
        customer: { name: string; email: string };
        plan: {
          name: string;
          duration: string;
          ram: string;
          storage: string;
          storageType: string;
          cpu: string;
          processor: string;
        };
      };
      payment: { provider: string; status: string; message: string };
    }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async submitContact(payload: {
    name: string;
    email: string;
    message: string;
  }) {
    return http<{ success: boolean; message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ====== Admin endpoints ======
  async checkSession() {
    return http<{
      authenticated: boolean;
      user?: { email: string; name?: string | null };
    }>("/api/auth/session-check");
  },
  async getAdminPlans() {
    return http<{ plans: AdminPlan[] }>("/api/admin/plans");
  },
  async createPlan(payload: Record<string, unknown>) {
    return http<{ plan: AdminPlan }>("/api/admin/plans", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async updatePlan(id: string, payload: Record<string, unknown>) {
    return http<{ plan: AdminPlan }>(`/api/admin/plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  async togglePlanVisibility(id: string, isVisible?: boolean) {
    return http<{ plan: AdminPlan }>(`/api/admin/plans/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isVisible }),
    });
  },
  async deletePlan(id: string) {
    return http<{ success: boolean }>(`/api/admin/plans/${id}`, {
      method: "DELETE",
    });
  },
  async getCategories() {
    return http<{ categories: Category[] }>("/api/admin/categories");
  },
  async createCategory(name: string) {
    return http<{ category: Category }>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
  async updateCategory(id: string, name: string) {
    return http<{ category: Category }>(`/api/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },
  async deleteCategory(id: string) {
    return http<{ success: boolean }>(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
  },
  async getOrders() {
    return http<{ orders: AdminOrder[] }>("/api/admin/orders");
  },
  async updateOrderStatus(id: string, status: string) {
    return http<{ order: AdminOrder }>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  async getCustomers() {
    return http<{ customers: AdminCustomer[] }>("/api/admin/customers");
  },
  async getStats() {
    return http<{ stats: AdminStats }>("/api/admin/stats");
  },
  async getSettings() {
    return http<{
      settings: {
        supportEmail: string;
        discordUrl: string;
        contactPhone: string;
      };
      payment: { provider: string; configured: boolean };
    }>("/api/admin/settings");
  },
  async updateSettings(payload: {
    supportEmail?: string;
    discordUrl?: string;
    contactPhone?: string;
  }) {
    return http<{ success: boolean }>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
