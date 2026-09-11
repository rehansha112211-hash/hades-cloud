/**
 * HADES CLOUD — Database seed script.
 * Usage: bun run scripts/seed.ts
 *
 * Idempotent: safe to run multiple times. Creates admin user, default categories,
 * demo plans, demo customers and demo orders if they don't already exist.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? "admin@hadescloud.local";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "hadescloud123";
const ADMIN_NAME = process.env.ADMIN_SEED_NAME ?? "Hades Cloud Admin";

async function main() {
  console.log("→ Seeding HADES CLOUD database...");

  // 1. Admin user
  const existingAdmin = await db.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await db.adminUser.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        passwordHash,
        role: "OWNER",
      },
    });
    console.log(`  ✓ Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log(`  • Admin user already exists: ${ADMIN_EMAIL}`);
  }

  // 2. Categories
  const categories = [
    { name: "DIRT" },
    { name: "STONE" },
    { name: "IRON" },
    { name: "DIAMOND" },
    { name: "NETHERITE" },
  ];
  const categoryMap: Record<string, { id: string }> = {};
  for (const c of categories) {
    const slug = c.name.toLowerCase();
    const row =
      (await db.category.findUnique({ where: { slug } })) ??
      (await db.category.create({ data: { name: c.name, slug } }));
    categoryMap[c.name] = { id: row.id };
  }
  console.log(`  ✓ ${categories.length} categories ready`);

  // 3. Plans (only if zero plans exist)
  const planCount = await db.plan.count();
  if (planCount === 0) {
    const plans = [
      {
        name: "DIRT",
        categoryId: categoryMap.DIRT.id,
        price: 49,
        duration: "1 Month",
        ram: "2 GB",
        storage: "20 GB",
        storageType: "NVMe",
        cpu: "2 vCPU",
        processor: "AMD Ryzen 5",
        sortOrder: 1,
      },
      {
        name: "STONE",
        categoryId: categoryMap.STONE.id,
        price: 99,
        duration: "1 Month",
        ram: "4 GB",
        storage: "60 GB",
        storageType: "NVMe",
        cpu: "3 vCPU",
        processor: "AMD Ryzen 5",
        sortOrder: 2,
      },
      {
        name: "IRON",
        categoryId: categoryMap.IRON.id,
        price: 199,
        duration: "1 Month",
        ram: "6 GB",
        storage: "120 GB",
        storageType: "NVMe",
        cpu: "4 vCPU",
        processor: "AMD Ryzen 7",
        sortOrder: 3,
      },
      {
        name: "DIAMOND",
        categoryId: categoryMap.DIAMOND.id,
        price: 349,
        duration: "1 Month",
        ram: "8 GB",
        storage: "180 GB",
        storageType: "NVMe",
        cpu: "6 vCPU",
        processor: "AMD Ryzen 9",
        sortOrder: 4,
      },
      {
        name: "NETHERITE",
        categoryId: categoryMap.NETHERITE.id,
        price: 599,
        duration: "1 Month",
        ram: "16 GB",
        storage: "320 GB",
        storageType: "NVMe",
        cpu: "8 vCPU",
        processor: "AMD Ryzen 9",
        sortOrder: 5,
      },
    ];
    for (const p of plans) {
      await db.plan.create({ data: p });
    }
    console.log(`  ✓ ${plans.length} demo plans created`);
  } else {
    console.log(`  • ${planCount} plans already exist, skipping plan seed`);
  }

  // 4. FAQ
  const faqCount = await db.faq.count();
  if (faqCount === 0) {
    const faqs = [
      {
        question: "What is Minecraft hosting?",
        answer:
          "Minecraft hosting is a remote server you rent so you and your friends can play Minecraft together 24/7 — without anyone needing to keep their personal computer online or run the server software locally. We host the server in a data center on high-performance hardware and you manage it through a web control panel.",
        sortOrder: 1,
      },
      {
        question: "How quickly is my server deployed?",
        answer:
          "Most servers are provisioned automatically within a few minutes of successful payment. During high-demand windows or for custom configurations, deployment may take a little longer — but you will always receive a confirmation once the server is ready.",
        sortOrder: 2,
      },
      {
        question: "What storage do you use?",
        answer:
          "All plans use NVMe SSD storage, which offers dramatically faster read and write speeds than traditional SATA SSDs or hard drives. This translates to faster chunk loading, smoother world saves and better overall responsiveness for your players.",
        sortOrder: 3,
      },
      {
        question: "Can I upgrade my plan?",
        answer:
          "Yes — you can upgrade or downgrade at any time from your customer dashboard. Upgrades are prorated based on the remaining time in your billing cycle, and the new resource allocation is applied to your server after a short restart.",
        sortOrder: 4,
      },
      {
        question: "How does billing work?",
        answer:
          "Billing is recurring on the duration you select at checkout — monthly, quarterly, semi-annually or annually. You can cancel future renewals at any time and your server will continue running until the end of the current paid period.",
        sortOrder: 5,
      },
      {
        question: "Do you provide DDoS protection?",
        answer:
          "Yes. All Hades Cloud servers sit behind network-level DDoS protection designed to absorb and mitigate common attack vectors targeting Minecraft servers. Protection is included with every plan at no additional cost.",
        sortOrder: 6,
      },
      {
        question: "How can I contact support?",
        answer:
          "You can reach our team through the contact form on this website or via our community Discord. Most tickets are answered within a few hours during business days; urgent infrastructure issues are monitored around the clock.",
        sortOrder: 7,
      },
    ];
    for (const f of faqs) {
      await db.faq.create({ data: f });
    }
    console.log(`  ✓ ${faqs.length} FAQ entries created`);
  } else {
    console.log(`  • ${faqCount} FAQ already exist, skipping FAQ seed`);
  }

  // 5. Demo customers + orders
  const orderCount = await db.order.count();
  if (orderCount === 0) {
    const customers = [
      { name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 43210" },
      { name: "Priya Patel", email: "priya@example.com", phone: "+91 90000 11111" },
      { name: "Rohan Mehta", email: "rohan@example.com" },
      { name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 81234 56780" },
      { name: "Vikram Reddy", email: "vikram@example.com" },
    ];
    const plans = await db.plan.findMany();
    const statuses = ["PENDING_PAYMENT", "AWAITING_PAYMENT", "PAID", "PAID", "PAID"];
    for (const c of customers) {
      const cust = await db.customer.create({ data: c });
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const orderNumber = `HC-2026-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;
      await db.order.create({
        data: {
          orderNumber,
          customerId: cust.id,
          planId: plan.id,
          amount: plan.price,
          status,
        },
      });
    }
    console.log(`  ✓ ${customers.length} demo customers + orders created`);
  } else {
    console.log(`  • ${orderCount} orders already exist, skipping demo seed`);
  }

  console.log("→ Seed complete.");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
