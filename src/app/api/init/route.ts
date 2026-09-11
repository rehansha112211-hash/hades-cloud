import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * GET /api/init
 * One-time database initialization endpoint.
 * Seeds admin user, categories, plans, FAQs if the DB is empty.
 * Idempotent — safe to call multiple times.
 */
export async function GET() {
  try {
    const results: string[] = [];

    // 1. Admin user
    const ADMIN_EMAIL = "admin@hadescloud.local";
    const ADMIN_PASSWORD = "hadescloud123";
    const existingAdmin = await db.adminUser.findUnique({
      where: { email: ADMIN_EMAIL },
    });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await db.adminUser.create({
        data: {
          email: ADMIN_EMAIL,
          name: "Hades Cloud Admin",
          passwordHash,
          role: "OWNER",
        },
      });
      results.push("Admin user created");
    } else {
      results.push("Admin user already exists");
    }

    // 2. Categories
    const categories = ["DIRT", "STONE", "IRON", "DIAMOND", "NETHERITE"];
    const categoryMap: Record<string, string> = {};
    for (const name of categories) {
      const slug = name.toLowerCase();
      const row =
        (await db.category.findUnique({ where: { slug } })) ??
        (await db.category.create({ data: { name, slug } }));
      categoryMap[name] = row.id;
    }
    results.push(`${categories.length} categories ready`);

    // 3. Plans
    const planCount = await db.plan.count();
    if (planCount === 0) {
      const plans = [
        { name: "DIRT", categoryId: categoryMap.DIRT, price: 49, duration: "1 Month", ram: "2 GB", storage: "20 GB", storageType: "NVMe", cpu: "2 vCPU", processor: "AMD Ryzen 5", sortOrder: 1 },
        { name: "STONE", categoryId: categoryMap.STONE, price: 99, duration: "1 Month", ram: "4 GB", storage: "60 GB", storageType: "NVMe", cpu: "3 vCPU", processor: "AMD Ryzen 5", sortOrder: 2 },
        { name: "IRON", categoryId: categoryMap.IRON, price: 199, duration: "1 Month", ram: "6 GB", storage: "120 GB", storageType: "NVMe", cpu: "4 vCPU", processor: "AMD Ryzen 7", sortOrder: 3 },
        { name: "DIAMOND", categoryId: categoryMap.DIAMOND, price: 349, duration: "1 Month", ram: "8 GB", storage: "180 GB", storageType: "NVMe", cpu: "6 vCPU", processor: "AMD Ryzen 9", sortOrder: 4 },
        { name: "NETHERITE", categoryId: categoryMap.NETHERITE, price: 599, duration: "1 Month", ram: "16 GB", storage: "320 GB", storageType: "NVMe", cpu: "8 vCPU", processor: "AMD Ryzen 9", sortOrder: 5 },
      ];
      for (const p of plans) {
        await db.plan.create({ data: p });
      }
      results.push("5 plans created");
    } else {
      results.push(`${planCount} plans already exist`);
    }

    // 4. FAQs
    const faqCount = await db.faq.count();
    if (faqCount === 0) {
      const faqs = [
        { question: "What is Minecraft hosting?", answer: "Minecraft hosting is a remote server you rent so you and your friends can play Minecraft together 24/7 — without anyone needing to keep their personal computer online.", sortOrder: 1 },
        { question: "How quickly is my server deployed?", answer: "Most servers are provisioned automatically within a few minutes of successful payment.", sortOrder: 2 },
        { question: "What storage do you use?", answer: "All plans use NVMe SSD storage, which offers dramatically faster read and write speeds than traditional SSDs.", sortOrder: 3 },
        { question: "Can I upgrade my plan?", answer: "Yes — you can upgrade or downgrade at any time from your customer dashboard.", sortOrder: 4 },
        { question: "How does billing work?", answer: "Billing is recurring on the duration you select at checkout — monthly, quarterly, semi-annually or annually.", sortOrder: 5 },
        { question: "Do you provide DDoS protection?", answer: "Yes. All Hades Cloud servers sit behind network-level DDoS protection at no additional cost.", sortOrder: 6 },
        { question: "How can I contact support?", answer: "You can reach our team through the contact form on this website or via our community Discord.", sortOrder: 7 },
      ];
      for (const f of faqs) {
        await db.faq.create({ data: f });
      }
      results.push("7 FAQs created");
    } else {
      results.push(`${faqCount} FAQs already exist`);
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized",
      results,
    });
  } catch (err) {
    console.error("[init] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
