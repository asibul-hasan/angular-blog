import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Lang = 'en' | 'bn';

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    hero: {
      badge: '🇧🇩 Built for Bangladesh',
      h1a: 'The ERP that grows with your business —',
      h1b: 'in Bengali, for Bangladesh.',
      sub: 'Purpose-built for Retail, Wholesale & Pharmacies. Fully integrated POS, Inventory, HR, and Accounts — delivered in phases so your business never skips a beat.',
      cta1: '📞 Book a Free Demo',
      cta2: 'View Pricing →',
      stat1: '50+',
      stat1l: 'Screens & Forms',
      stat2: '7',
      stat2l: 'Core Modules',
      stat3: '5-Phase',
      stat3l: 'Implementation',
    },
    sec: {
      modules: 'Core Modules',
      modulesH: 'Everything your business needs, in one platform',
      modulesSub:
        '7 fully integrated modules covering every function of your business.',
      industries: 'Industries',
      industriesH: 'Solutions for Your Industry',
      indSub:
        "AidlyERP adapts to your sector's specific needs — from pharma compliance to multi-branch retail.",
      why: 'Why Choose Us',
      whyH: 'Why AidlyERP?',
      whySub:
        "We don't just build software. We understand Bangladeshi business — VAT rules, multi-branch headaches, local payment methods.",
      phases: 'Rollout',
      phasesH: '5-Phase Implementation',
      phasesSub:
        '"We don\'t just dump software on you. We implement it in stages so your staff is never overwhelmed."',
      onboard: 'Onboarding',
      onboardH: 'How We Get You Live',
      onboardSub:
        'From your first conversation to your first live transaction — a smooth 4-step process.',
      compare: 'Comparison',
      compareH: 'AidlyERP vs. The Rest',
      compareSub:
        'See how we stack up against the alternatives in the market today.',
      faq: 'FAQs',
      faqH: 'Frequently Asked Questions',
      stories: 'Success Stories',
      storiesH: 'Businesses Growing with AidlyERP',
      ctaH: 'Ready to Transform Your Business?',
      ctaSub:
        "Book a free demo today — we'll show you exactly how AidlyERP works for your business.",
      ctaBtn1: '📞 Book a Free Demo',
      ctaBtn2: 'View Pricing →',
    },
    modules: [
      {
        icon: '🛡️',
        name: 'System Administration',
        desc: 'Multi-branch setup, role-based security, user management, and a dynamic menu builder.',
        tags: ['Company Setup', 'Role Permissions', 'Activity Logs'],
        color: 'indigo',
      },
      {
        icon: '📦',
        name: 'Inventory Management',
        desc: 'Full product catalog with barcode generation, batch & expiry tracking, and reorder alerts.',
        tags: ['Batch Control', 'Warehouse', 'Reorder Alerts'],
        color: 'green',
      },
      {
        icon: '🛒',
        name: 'Sales & POS',
        desc: 'High-speed retail POS with barcode scanner, discount management, VAT, and daily closing.',
        tags: ['POS Screen', 'Daily Closing', 'Customer Dues'],
        color: 'orange',
      },
      {
        icon: '🚚',
        name: 'Procurement',
        desc: 'Complete procure-to-pay: supplier management, purchase orders, invoices, and returns.',
        tags: ['Purchase Orders', 'Supplier Payments'],
        color: 'blue',
      },
      {
        icon: '💰',
        name: 'Finance & Accounts',
        desc: 'Full double-entry accounting with vouchers, expense tracking, and multi-branch consolidation.',
        tags: ['Vouchers', 'Branch Ledger', 'VAT Compliance'],
        color: 'purple',
      },
      {
        icon: '👥',
        name: 'HR & Payroll',
        desc: 'Employee records, biometric attendance sync, salary structure, and payslip generation.',
        tags: ['Biometric Sync', 'Payslips', 'Payroll'],
        color: 'rose',
      },
      {
        icon: '📊',
        name: 'Reporting & Analytics',
        desc: 'Real-time dashboards for sales, inventory, and full financial statements including balance sheet.',
        tags: [
          'Sales Dashboard',
          'Inventory Reports',
          'Balance Sheet',
          'Trial Balance',
        ],
        color: 'teal',
        wide: true,
      },
    ],
    industries: [
      {
        icon: '🏪',
        name: 'Retail & Supermarkets',
        desc: 'Centralized stock, multi-branch POS, and NBR VAT compliance.',
        idealFor: 'Supermarkets, clothing stores, electronics shops',
        fit: '★★★★★',
        fitClass: 'best',
      },
      {
        icon: '💊',
        name: 'Pharmacies',
        desc: 'Drug expiry tracking, batch control, and supplier credit management.',
        idealFor: 'Independent pharmacies and small chains',
        fit: '★★★★★',
        fitClass: 'best',
      },
      {
        icon: '📦',
        name: 'Wholesale & Trading',
        desc: 'Large supplier base management and customer credit tracking.',
        idealFor: 'Importers, distributors, FMCG wholesalers',
        fit: '★★★★☆',
        fitClass: 'strong',
      },
      {
        icon: '🥦',
        name: 'Food & Grocery',
        desc: 'Perishable inventory management with daily stock reconciliation.',
        idealFor: 'Grocery chains and organized food stores',
        fit: '★★★★☆',
        fitClass: 'strong',
      },
      {
        icon: '🏭',
        name: 'Light Manufacturing',
        desc: 'Raw material procurement and staff payroll management.',
        idealFor: 'Garments, plastics, and FMCG factories',
        fit: '★★★☆☆',
        fitClass: 'moderate',
      },
      {
        icon: '🏥',
        name: 'Service Businesses',
        desc: 'Expense management, patient billing, and HR & payroll.',
        idealFor: 'Clinics, diagnostics, and coaching centers',
        fit: '★★★☆☆',
        fitClass: 'moderate',
      },
    ],
    why: [
      {
        icon: '🏦',
        title: 'Built for Bangladesh',
        desc: 'BDT currency, NBR VAT compliance, and Bangla-first business logic — not a foreign ERP adapted for BD.',
      },
      {
        icon: '🔒',
        title: 'Role-Based Security',
        desc: "Every user sees only what they're permitted to — down to individual buttons. Full activity audit trail.",
      },
      {
        icon: '📱',
        title: 'Modern, Intuitive UI',
        desc: 'Staff learn in days, not months. Clean dashboards mean your team spends time selling, not fighting software.',
      },
      {
        icon: '📊',
        title: 'Real-Time Insights',
        desc: 'Live dashboards for sales, stock, and profit — accessible from any device across all branches.',
      },
      {
        icon: '🤝',
        title: 'Dedicated Local Support',
        desc: 'Phone and remote support in Bengali. Real people who know your business — not a foreign help desk.',
      },
    ],
    phases: [
      {
        num: 1,
        name: 'Core Setup',
        desc: 'System Admin, Inventory & Sales/POS',
        color: '#0F52BA',
      },
      {
        num: 2,
        name: 'Procurement',
        desc: 'Supplier management & purchase system',
        color: '#0284C7',
      },
      {
        num: 3,
        name: 'Finance & HR',
        desc: 'Accounts, payroll, and attendance',
        color: '#7C3AED',
      },
      {
        num: 4,
        name: 'Advanced Reporting',
        desc: 'BI reports and audit trails',
        color: '#059669',
      },
      {
        num: 5,
        name: 'Customization',
        desc: 'Tailor for full scale rollout',
        color: '#F59E0B',
      },
    ],
    onboard: [
      {
        num: 1,
        title: 'Discovery',
        desc: 'Business process review and data audit (1–2 days)',
      },
      {
        num: 2,
        title: 'Setup',
        desc: 'System configuration and master data setup (3–5 days)',
      },
      {
        num: 3,
        title: 'Training',
        desc: 'Role-based training for cashiers and managers (2 days)',
      },
      {
        num: 4,
        title: 'Go Live 🎉',
        desc: 'Live support for first 2 weeks and handover',
      },
    ],
    compareFeatures: [
      'Integrated POS + HR + Accounts',
      'Affordability (SME Pricing)',
      'Local VAT & NBR Compliance',
      'Implementation Speed',
      'Local Support in Bengali',
      'Phased Rollout (No Disruption)',
    ],
    compareAidly: [
      '✓ Yes',
      '✓ High',
      '✓ Built-In',
      '✓ 2–4 Weeks',
      '✓ Yes',
      '✓ Yes',
    ],
    compareTally: [
      '✗ Partial',
      'Medium',
      'Manual',
      'Varies',
      'Limited',
      '✗ No',
    ],
    compareOracle: [
      '✓ Yes',
      '✗ Very Low',
      'Complex',
      '✗ 6–12 Months',
      '✗ No',
      '✗ No',
    ],
    faqs: [
      {
        q: 'Is my data secure?',
        a: 'Yes. We use AWS Singapore or local cloud with daily backups, role-based access control, and full encryption in transit and at rest.',
      },
      {
        q: 'Does it work offline?',
        a: 'The POS module has offline capabilities to ensure billing never stops during internet outages. Data syncs automatically once connection is restored.',
      },
      {
        q: 'Can I upgrade my plan later?',
        a: 'Absolutely. Start with the Starter plan and upgrade as your business grows. All your data migrates automatically.',
      },
      {
        q: 'Do you provide training?',
        a: 'Yes. We provide 2 days of role-based training for all staff as part of the setup fee. Additional sessions available on request.',
      },
      {
        q: 'How many branches supported?',
        a: 'Starter: 1 branch. Business: up to 5 branches. Enterprise: unlimited branches with consolidated reporting.',
      },
      {
        q: 'Is it NBR VAT compliant?',
        a: 'Yes. NBR VAT rules, Mushak forms, and VAT reporting are all built in and fully automated.',
      },
    ],
    stories: [
      {
        icon: '🏪',
        grad: 'blue',
        name: 'Local Retail Chain 1',
        loc: 'Dhaka, 4 Branches',
        quote:
          '"AidlyERP reduced our stockouts by 80% and centralized our multi-branch operations in just 4 weeks."',
      },
      {
        icon: '💊',
        grad: 'green',
        name: 'Local Pharmacy Chain',
        loc: 'Chattogram, 2 Branches',
        quote:
          '"The expiry tracking alone saved us lakhs of taka. Multi-branch visibility completely changed how we work."',
      },
      {
        icon: '📦',
        grad: 'purple',
        name: 'Wholesale Distributor',
        loc: 'Sylhet, 6 Branches',
        quote:
          '"Our finance team now produces reports in minutes. AidlyERP is the best business decision we ever made."',
      },
    ],
  },
  bn: {
    hero: {
      badge: '🇧🇩 বাংলাদেশের জন্য তৈরি',
      h1a: 'আপনার ব্যবসার সাথে বেড়ে ওঠে এমন ইআরপি —',
      h1b: 'বাংলায়, বাংলাদেশের জন্য।',
      sub: 'রিটেইল, হোলসেল এবং ফার্মেসির জন্য বিশেষভাবে তৈরি। সম্পূর্ণ একীভূত POS, ইনভেন্টরি, HR এবং অ্যাকাউন্টস।',
      cta1: '📞 বিনামূল্যে ডেমো বুক করুন',
      cta2: 'মূল্য দেখুন →',
      stat1: '৫০+',
      stat1l: 'স্ক্রিন ও ফর্ম',
      stat2: '৭',
      stat2l: 'মূল মডিউল',
      stat3: '৫-ধাপ',
      stat3l: 'বাস্তবায়ন',
    },
    sec: {
      modules: 'মূল মডিউল',
      modulesH: 'আপনার ব্যবসার সব প্রয়োজন, এক প্ল্যাটফর্মে',
      modulesSub:
        '৭টি সম্পূর্ণ একীভূত মডিউল আপনার ব্যবসার প্রতিটি কার্যক্রম কভার করে।',
      industries: 'শিল্প',
      industriesH: 'আপনার শিল্পের জন্য সমাধান',
      indSub: 'AidlyERP আপনার সেক্টরের নির্দিষ্ট চাহিদার সাথে মানিয়ে নেয়।',
      why: 'কেন আমরা',
      whyH: 'কেন AidlyERP?',
      whySub: 'আমরা শুধু সফটওয়্যার তৈরি করি না। আমরা বাংলাদেশের ব্যবসা বুঝি।',
      phases: 'রোলআউট',
      phasesH: '৫-ধাপ বাস্তবায়ন',
      phasesSub: '"আমরা শুধু সফটওয়্যার দিই না — ধাপে ধাপে বাস্তবায়ন করি।"',
      onboard: 'অনবোর্ডিং',
      onboardH: 'কীভাবে আমরা আপনাকে লাইভ করি',
      onboardSub:
        'আপনার প্রথম কথোপকথন থেকে প্রথম লাইভ লেনদেন পর্যন্ত — একটি মসৃণ ৪-ধাপ প্রক্রিয়া।',
      compare: 'তুলনা',
      compareH: 'AidlyERP বনাম অন্যরা',
      compareSub: 'বাজারে উপলব্ধ বিকল্পগুলির সাথে তুলনা দেখুন।',
      faq: 'সাধারণ প্রশ্ন',
      faqH: 'প্রায়শই জিজ্ঞাসিত প্রশ্নসমূহ',
      stories: 'সাফল্যের গল্প',
      storiesH: 'AidlyERP দিয়ে বেড়ে উঠছে যেসব ব্যবসা',
      ctaH: 'আপনার ব্যবসা রূপান্তর করতে প্রস্তুত?',
      ctaSub:
        'আজই বিনামূল্যে ডেমো বুক করুন — আমরা আপনার নিজের ডেটা দিয়ে দেখাবো।',
      ctaBtn1: '📞 বিনামূল্যে ডেমো বুক করুন',
      ctaBtn2: 'মূল্য দেখুন →',
    },
    modules: [
      {
        icon: '🛡️',
        name: 'সিস্টেম অ্যাডমিন',
        desc: 'মাল্টি-ব্রাঞ্চ সেটআপ, রোল-ভিত্তিক নিরাপত্তা এবং ডায়নামিক মেনু বিল্ডার।',
        tags: ['কোম্পানি সেটআপ', 'রোল পার্মিশন', 'অ্যাক্টিভিটি লগ'],
        color: 'indigo',
      },
      {
        icon: '📦',
        name: 'ইনভেন্টরি ম্যানেজমেন্ট',
        desc: 'বারকোড, ব্যাচ ও মেয়াদ ট্র্যাকিং এবং রিঅর্ডার অ্যালার্ট সহ পণ্য ক্যাটালগ।',
        tags: ['ব্যাচ কন্ট্রোল', 'গুদাম', 'রিঅর্ডার অ্যালার্ট'],
        color: 'green',
      },
      {
        icon: '🛒',
        name: 'সেলস ও POS',
        desc: 'বারকোড স্ক্যানার, ডিসকাউন্ট, ভ্যাট এবং দৈনিক ক্লোজিং সহ দ্রুত রিটেইল POS।',
        tags: ['POS স্ক্রিন', 'দৈনিক ক্লোজিং', 'কাস্টমার ডিউ'],
        color: 'orange',
      },
      {
        icon: '🚚',
        name: 'প্রকিউরমেন্ট',
        desc: 'সরবরাহকারী ব্যবস্থাপনা, ক্রয় আদেশ, চালান এবং রিটার্ন সহ সম্পূর্ণ চক্র।',
        tags: ['ক্রয় আদেশ', 'সরবরাহকারী পেমেন্ট'],
        color: 'blue',
      },
      {
        icon: '💰',
        name: 'ফিনান্স ও অ্যাকাউন্টস',
        desc: 'ভাউচার, ব্যয় ট্র্যাকিং এবং মাল্টি-ব্রাঞ্চ একত্রীকরণ সহ সম্পূর্ণ ডাবল-এন্ট্রি।',
        tags: ['ভাউচার', 'শাখা খতিয়ান', 'ভ্যাট কমপ্লায়েন্স'],
        color: 'purple',
      },
      {
        icon: '👥',
        name: 'এইচআর ও পেরোল',
        desc: 'কর্মচারী রেকর্ড, বায়োমেট্রিক উপস্থিতি, বেতন কাঠামো এবং পেস্লিপ তৈরি।',
        tags: ['বায়োমেট্রিক সিঙ্ক', 'পেস্লিপ', 'পেরোল'],
        color: 'rose',
      },
      {
        icon: '📊',
        name: 'রিপোর্টিং ও অ্যানালিটিক্স',
        desc: 'বিক্রয়, ইনভেন্টরি এবং আর্থিক বিবরণী সহ রিয়েল-টাইম ড্যাশবোর্ড।',
        tags: ['বিক্রয় ড্যাশবোর্ড', 'ইনভেন্টরি রিপোর্ট', 'ব্যালেন্স শিট'],
        color: 'teal',
        wide: true,
      },
    ],
    industries: [
      {
        icon: '🏪',
        name: 'রিটেইল ও সুপারমার্কেট',
        desc: 'কেন্দ্রীভূত স্টক, মাল্টি-ব্রাঞ্চ POS এবং NBR ভ্যাট কমপ্লায়েন্স।',
        idealFor: 'সুপারমার্কেট, পোশাক দোকান, ইলেকট্রনিক্স শপ',
        fit: '★★★★★',
        fitClass: 'best',
      },
      {
        icon: '💊',
        name: 'ফার্মেসি',
        desc: 'ওষুধের মেয়াদ ট্র্যাকিং, ব্যাচ কন্ট্রোল এবং সরবরাহকারী ক্রেডিট।',
        idealFor: 'স্বাধীন ফার্মেসি এবং ছোট চেইন',
        fit: '★★★★★',
        fitClass: 'best',
      },
      {
        icon: '📦',
        name: 'হোলসেল ও ট্রেডিং',
        desc: 'বড় সরবরাহকারী বেস ব্যবস্থাপনা এবং গ্রাহক ক্রেডিট ট্র্যাকিং।',
        idealFor: 'আমদানিকারক, পরিবেশক, FMCG পাইকার',
        fit: '★★★★☆',
        fitClass: 'strong',
      },
      {
        icon: '🥦',
        name: 'খাদ্য ও মুদি',
        desc: 'পচনশীল পণ্যের ইনভেন্টরি ব্যবস্থাপনা এবং দৈনিক স্টক রিকনসিলিয়েশন।',
        idealFor: 'মুদি চেইন এবং সংগঠিত খাদ্য দোকান',
        fit: '★★★★☆',
        fitClass: 'strong',
      },
      {
        icon: '🏭',
        name: 'হালকা উৎপাদন',
        desc: 'কাঁচামাল ক্রয় এবং কর্মচারী বেতন ব্যবস্থাপনা।',
        idealFor: 'গার্মেন্টস, প্লাস্টিক এবং FMCG কারখানা',
        fit: '★★★☆☆',
        fitClass: 'moderate',
      },
      {
        icon: '🏥',
        name: 'সেবা ব্যবসা',
        desc: 'ব্যয় ব্যবস্থাপনা, বিলিং এবং HR ও পেরোল।',
        idealFor: 'ক্লিনিক, ডায়াগনস্টিক এবং কোচিং সেন্টার',
        fit: '★★★☆☆',
        fitClass: 'moderate',
      },
    ],
    why: [
      {
        icon: '🏦',
        title: 'বাংলাদেশের জন্য তৈরি',
        desc: 'BDT মুদ্রা, NBR ভ্যাট কমপ্লায়েন্স এবং বাংলা-প্রথম ব্যবসায়িক লজিক।',
      },
      {
        icon: '🔒',
        title: 'রোল-ভিত্তিক নিরাপত্তা',
        desc: 'প্রতিটি ব্যবহারকারী শুধুমাত্র তাদের অনুমোদিত তথ্য দেখতে পাবেন — সম্পূর্ণ অডিট ট্রেইল।',
      },
      {
        icon: '📱',
        title: 'আধুনিক ও সহজ UI',
        desc: 'কর্মীরা দিনের মধ্যে শেখে, মাস নয়। পরিষ্কার ড্যাশবোর্ড, দ্রুত অপারেশন।',
      },
      {
        icon: '📊',
        title: 'রিয়েল-টাইম অন্তর্দৃষ্টি',
        desc: 'সকল শাখায় বিক্রয়, স্টক এবং মুনাফার লাইভ ড্যাশবোর্ড।',
      },
      {
        icon: '🤝',
        title: 'স্থানীয় সহায়তা দল',
        desc: 'বাংলায় ফোন এবং রিমোট সহায়তা — বিদেশী হেল্প ডেস্ক নয়।',
      },
    ],
    phases: [
      {
        num: 1,
        name: 'মূল সেটআপ',
        desc: 'সিস্টেম অ্যাডমিন, ইনভেন্টরি এবং সেলস/POS',
        color: '#0F52BA',
      },
      {
        num: 2,
        name: 'প্রকিউরমেন্ট',
        desc: 'সরবরাহকারী ব্যবস্থাপনা ও ক্রয় সিস্টেম',
        color: '#0284C7',
      },
      {
        num: 3,
        name: 'ফিনান্স ও এইচআর',
        desc: 'অ্যাকাউন্টস, পেরোল এবং উপস্থিতি',
        color: '#7C3AED',
      },
      {
        num: 4,
        name: 'উন্নত রিপোর্টিং',
        desc: 'BI রিপোর্ট এবং অডিট ট্রেইল',
        color: '#059669',
      },
      {
        num: 5,
        name: 'কাস্টমাইজেশন',
        desc: 'সম্পূর্ণ স্কেল রোলআউটের জন্য কাস্টমাইজ',
        color: '#F59E0B',
      },
    ],
    onboard: [
      {
        num: 1,
        title: 'ডিসকভারি',
        desc: 'ব্যবসায়িক প্রক্রিয়া পর্যালোচনা এবং ডেটা অডিট (১–২ দিন)',
      },
      {
        num: 2,
        title: 'সেটআপ',
        desc: 'সিস্টেম কনফিগারেশন এবং মাস্টার ডেটা সেটআপ (৩–৫ দিন)',
      },
      {
        num: 3,
        title: 'প্রশিক্ষণ',
        desc: 'ক্যাশিয়ার ও ম্যানেজারদের জন্য রোল-ভিত্তিক প্রশিক্ষণ (২ দিন)',
      },
      {
        num: 4,
        title: 'গো লাইভ 🎉',
        desc: 'প্রথম ২ সপ্তাহ লাইভ সহায়তা এবং হস্তান্তর',
      },
    ],
    compareFeatures: [
      'ইন্টিগ্রেটেড POS + HR + অ্যাকাউন্টস',
      'সাশ্রয়ী মূল্য (SME মূল্য নির্ধারণ)',
      'স্থানীয় ভ্যাট ও NBR কমপ্লায়েন্স',
      'বাস্তবায়নের গতি',
      'বাংলায় স্থানীয় সহায়তা',
      'ধাপে ধাপে রোলআউট',
    ],
    compareAidly: [
      '✓ হ্যাঁ',
      '✓ উচ্চ',
      '✓ বিল্ট-ইন',
      '✓ ২–৪ সপ্তাহ',
      '✓ হ্যাঁ',
      '✓ হ্যাঁ',
    ],
    compareTally: [
      '✗ আংশিক',
      'মাঝারি',
      'ম্যানুয়াল',
      'পরিবর্তনশীল',
      'সীমিত',
      '✗ না',
    ],
    compareOracle: [
      '✓ হ্যাঁ',
      '✗ অনেক কম',
      'জটিল',
      '✗ ৬–১২ মাস',
      '✗ না',
      '✗ না',
    ],
    faqs: [
      {
        q: 'আমার ডেটা কি নিরাপদ?',
        a: 'হ্যাঁ। আমরা AWS সিঙ্গাপুর বা স্থানীয় ক্লাউড ব্যবহার করি। প্রতিদিন ব্যাকআপ, রোল-ভিত্তিক অ্যাক্সেস এবং সম্পূর্ণ এনক্রিপশন।',
      },
      {
        q: 'অফলাইনে কি কাজ করে?',
        a: 'POS মডিউলে অফলাইন সক্ষমতা আছে — ইন্টারনেট না থাকলেও বিলিং চলে। সংযোগ ফিরলে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়।',
      },
      {
        q: 'পরে কি প্ল্যান আপগ্রেড করতে পারবো?',
        a: 'অবশ্যই। স্টার্টার প্ল্যান দিয়ে শুরু করুন এবং ব্যবসার সাথে আপগ্রেড করুন। সমস্ত ডেটা স্বয়ংক্রিয়ভাবে মাইগ্রেট হয়।',
      },
      {
        q: 'প্রশিক্ষণ কি দেওয়া হয়?',
        a: 'হ্যাঁ। সেটআপ ফির অংশ হিসেবে সকল স্টাফের জন্য ২ দিনের রোল-ভিত্তিক প্রশিক্ষণ প্রদান করা হয়।',
      },
      {
        q: 'কতটি শাখা সাপোর্ট করে?',
        a: 'স্টার্টার: ১ শাখা। বিজনেস: ৫টি পর্যন্ত। এন্টারপ্রাইজ: সীমাহীন শাখা একত্রিত রিপোর্টিং সহ।',
      },
      {
        q: 'NBR ভ্যাট কমপ্লায়েন্ট কি?',
        a: 'হ্যাঁ। NBR ভ্যাট নিয়ম, মুশাক ফর্ম এবং ভ্যাট রিপোর্টিং সম্পূর্ণ স্বয়ংক্রিয়ভাবে বিল্ট-ইন।',
      },
    ],
    stories: [
      {
        icon: '🏪',
        grad: 'blue',
        name: 'স্থানীয় রিটেইল চেইন ১',
        loc: 'ঢাকা, ৪টি শাখা',
        quote:
          '"AidlyERP আমাদের স্টকআউট ৮০% কমিয়েছে এবং মাত্র ৪ সপ্তাহে মাল্টি-ব্রাঞ্চ কেন্দ্রীভূত করেছে।"',
      },
      {
        icon: '💊',
        grad: 'green',
        name: 'স্থানীয় ফার্মেসি চেইন',
        loc: 'চট্টগ্রাম, ২টি শাখা',
        quote:
          '"মেয়াদ ট্র্যাকিং একাই আমাদের লক্ষ টাকা বাঁচিয়েছে। মাল্টি-ব্রাঞ্চ দৃশ্যমানতা আমাদের কাজের ধরন পাল্টে দিয়েছে।"',
      },
      {
        icon: '📦',
        grad: 'purple',
        name: 'হোলসেল পরিবেশক',
        loc: 'সিলেট, ৬টি শাখা',
        quote:
          '"আমাদের ফিনান্স টিম এখন মিনিটে রিপোর্ট তৈরি করে। AidlyERP আমাদের সেরা ব্যবসায়িক সিদ্ধান্ত।"',
      },
    ],
  },
};

@Component({
  selector: 'app-aidly-erp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aidly-erp.component.html',
  styleUrls: ['./aidly-erp.component.css'],
})
export class AidlyErpComponent implements OnInit {
  // ── State ──────────────────────────────────────────────────────────────────
  lang = signal<Lang>('en');
  isDark = signal<boolean>(true);
  openFaq = signal<number | null>(null);
  chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartHeights = ['40%', '65%', '50%', '80%', '60%', '95%', '30%'];

  // ── Computed translation shortcut ─────────────────────────────────────────
  get t() {
    return TRANSLATIONS[this.lang()];
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Only access localStorage in browser (not during SSR)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('aidly-theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const dark = saved ? saved === 'dark' : prefersDark;
      this.isDark.set(dark);
      this.applyTheme(dark);
    }
  }

  // ── Theme ─────────────────────────────────────────────────────────────────
  toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    // Only access localStorage in browser
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('aidly-theme', next ? 'dark' : 'light');
    }
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', dark);
      root.classList.toggle('light', !dark);
    }
  }

  // ── Language ──────────────────────────────────────────────────────────────
  setLang(l: Lang): void {
    this.lang.set(l);
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  toggleFaq(i: number): void {
    this.openFaq.set(this.openFaq() === i ? null : i);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  isLast(arr: any[], i: number): boolean {
    return i === arr.length - 1;
  }

  compareClass(val: string): string {
    if (!val) return 'val-muted';
    if (val.startsWith('✓')) return 'val-green';
    if (val.startsWith('✗')) return 'val-red';
    return 'val-muted';
  }
}
