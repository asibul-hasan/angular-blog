/**
 * Unified System Menu Configuration (Aidly PMS Architecture)
 * Structured around 4 core operational modules + Standalone Dashboard:
 * - INT: Talent & Interns (ইন্টার্ন ও ট্র্যাকিং)
 * - PUB: Content & Editorial (পাবলিকেশন ও ব্লগ)
 * - REC: Careers & Hiring (নিয়োগ ও আবেদন)
 * - ADM: Platform Administration (সিস্টেম ও এক্সেস)
 *
 * Dashboard (DASH_1001) lives as a standalone Home link on the rail.
 */

export interface SystemScreen {
  readonly form_id: string;
  readonly title: string;
  readonly route: string;
  readonly icon?: string;
  readonly description?: string;
  readonly permission_code?: string;
  readonly badge?: string;
}

export interface SidebarSubModule {
  readonly key: string;
  readonly name: string;
  readonly name_bn?: string;
  readonly icon: string;
  readonly screens: readonly SystemScreen[];
}

export interface SidebarModule {
  readonly module: string;
  readonly module_bn?: string;
  readonly module_code: 'INT' | 'PUB' | 'REC' | 'ADM';
  readonly icon: string;
  readonly default_route: string;
  readonly sub_modules: readonly SidebarSubModule[];
}

export const HOME_FORM_ID = 'DASH_1001';

export const HOME_SCREEN: SystemScreen = {
  form_id: HOME_FORM_ID,
  title: 'Executive Dashboard',
  route: '/dashboard',
  icon: 'fa-solid fa-gauge-high',
  description: 'Real-time telemetry, visitor engagement, platform metrics, and core analytics.',
};

export const SIDEBAR_MODULES: readonly SidebarModule[] = [
  // 1. TALENT & INTERNS
  {
    module: 'Talent & Intern Hub',
    module_bn: 'ইন্টার্ন ও ট্র্যাকিং',
    module_code: 'INT',
    icon: 'fa-solid fa-user-graduate',
    default_route: '/dashboard/intern-management/list',
    sub_modules: [
      {
        key: 'int_roster',
        name: 'Intern Roster',
        name_bn: 'ইন্টার্ন তালিকা',
        icon: 'fa-solid fa-users',
        screens: [
          {
            form_id: 'INT_101',
            title: 'Track Active Interns',
            route: '/dashboard/intern-management/list',
            icon: 'fa-solid fa-address-book',
            description: 'Roster of 16 interns across Python, Web, ML, and AI cohorts.',
          },
          {
            form_id: 'INT_102',
            title: 'Task Review Studio',
            route: '/dashboard/intern-management/task-review',
            icon: 'fa-solid fa-check-double',
            description: 'Evaluate candidate submissions and approve milestone deliverables.',
          },
        ],
      },
      {
        key: 'int_directives',
        name: 'Directives & Tracks',
        name_bn: 'কোর্স ও ডিরেক্টিভ',
        icon: 'fa-solid fa-network-wired',
        screens: [
          {
            form_id: 'INT_103',
            title: 'Domain Directives',
            route: '/dashboard/intern-management/domain-tasks',
            icon: 'fa-solid fa-list-check',
            description: 'Architect learning paths and structured milestones per domain.',
          },
          {
            form_id: 'INT_104',
            title: 'My Directed Tasks',
            route: '/dashboard/intern/tasks',
            icon: 'fa-solid fa-flag-checkered',
            description: 'Candidate training roadmap and assigned milestones.',
          },
        ],
      },
    ],
  },

  // 2. CONTENT & EDITORIAL
  {
    module: 'Content Studio',
    module_bn: 'পাবলিকেশন ও ব্লগ',
    module_code: 'PUB',
    icon: 'fa-solid fa-newspaper',
    default_route: '/dashboard/blog-management/blogs',
    sub_modules: [
      {
        key: 'pub_editorial',
        name: 'Editorial Articles',
        name_bn: 'আর্টিকেল ও পোস্ট',
        icon: 'fa-solid fa-book-open',
        screens: [
          {
            form_id: 'PUB_201',
            title: 'All Published Stories',
            route: '/dashboard/blog-management/blogs',
            icon: 'fa-solid fa-layer-group',
            description: 'Review, edit, and orchestrate all 33 live articles and drafts.',
          },
          {
            form_id: 'PUB_202',
            title: 'Story Studio (Write)',
            route: '/dashboard/blog-management/blog/create',
            icon: 'fa-solid fa-pen-nib',
            description: 'Author new technical articles, whitepapers, and guides.',
          },
        ],
      },
      {
        key: 'pub_taxonomy',
        name: 'Taxonomy & Tags',
        name_bn: 'ক্যাটেগরি ও ট্যাগ',
        icon: 'fa-solid fa-tags',
        screens: [
          {
            form_id: 'PUB_203',
            title: 'Categories & Topics',
            route: '/dashboard/blog-management/categories',
            icon: 'fa-solid fa-folder-tree',
            description: 'Manage categorization topics and publication taxonomy.',
          },
        ],
      },
    ],
  },

  // 3. CAREERS & TALENT ACQUISITION
  {
    module: 'Talent Acquisition',
    module_bn: 'ক্যারিয়ার ও নিয়োগ',
    module_code: 'REC',
    icon: 'fa-solid fa-briefcase',
    default_route: '/dashboard/job-management/job-applications',
    sub_modules: [
      {
        key: 'rec_pipeline',
        name: 'Candidate Pipeline',
        name_bn: 'আবেদনকারী পাইপলাইন',
        icon: 'fa-solid fa-file-contract',
        screens: [
          {
            form_id: 'REC_301',
            title: 'Candidate Applications',
            route: '/dashboard/job-management/job-applications',
            icon: 'fa-solid fa-users-viewfinder',
            description: 'Evaluate candidate dossiers, schedule interviews, and track hires.',
          },
        ],
      },
      {
        key: 'rec_postings',
        name: 'Job Openings',
        name_bn: 'চাকরির সার্কুলার',
        icon: 'fa-solid fa-list-ul',
        screens: [
          {
            form_id: 'REC_302',
            title: 'Active Job Postings',
            route: '/dashboard/job-management/jobs',
            icon: 'fa-solid fa-rectangle-list',
            description: 'Manage corporate job listings, compensation, and deadlines.',
          },
          {
            form_id: 'REC_303',
            title: 'Post New Opening',
            route: '/dashboard/job-management/job/create',
            icon: 'fa-solid fa-circle-plus',
            description: 'Architect and publish a new career opportunity.',
          },
        ],
      },
    ],
  },

  // 4. PLATFORM ADMINISTRATION
  {
    module: 'Administration',
    module_bn: 'সিস্টেম ও এক্সেস',
    module_code: 'ADM',
    icon: 'fa-solid fa-shield-halved',
    default_route: '/dashboard/user-management/users',
    sub_modules: [
      {
        key: 'adm_identity',
        name: 'User Identity',
        name_bn: 'ইউজার ম্যানেজমেন্ট',
        icon: 'fa-solid fa-users-gear',
        screens: [
          {
            form_id: 'ADM_401',
            title: 'Team & User Directory',
            route: '/dashboard/user-management/users',
            icon: 'fa-solid fa-users',
            description: 'User accounts, verified credentials, and team contributors.',
          },
          {
            form_id: 'ADM_402',
            title: 'My Profile & Account',
            route: '/dashboard/user-management/my-profile',
            icon: 'fa-solid fa-user-gear',
            description: 'Account settings, contact details, and password rotation.',
          },
        ],
      },
      {
        key: 'adm_governance',
        name: 'Access & Governance',
        name_bn: 'নিরাপত্তা ও এক্সেস',
        icon: 'fa-solid fa-lock',
        screens: [
          {
            form_id: 'ADM_403',
            title: 'User Access Matrix',
            route: '/dashboard/settings/user-access-management',
            icon: 'fa-solid fa-user-shield',
            description: 'Role-based access control and account activation state.',
          },
          {
            form_id: 'ADM_404',
            title: 'Module Permissions',
            route: '/dashboard/settings/module-access-management',
            icon: 'fa-solid fa-key',
            description: 'CRUD permission governance across system modules.',
          },
          {
            form_id: 'ADM_405',
            title: 'Company Organizations',
            route: '/dashboard/settings/company-management',
            icon: 'fa-solid fa-building',
            description: 'Corporate entities, legal registrations, and profiles.',
          },
          {
            form_id: 'ADM_406',
            title: 'Client Inquiries & Leads',
            route: '/dashboard/settings/contact-messages',
            icon: 'fa-solid fa-envelope-open-text',
            description: 'Incoming website inquiries, contact leads, and client messages.',
          },
        ],
      },
    ],
  },
];

export function getSidebarTree(): readonly SidebarModule[] {
  return SIDEBAR_MODULES;
}

export function getScreenByFormId(formId: string): SystemScreen {
  if (formId === HOME_FORM_ID) return HOME_SCREEN;
  for (const mod of SIDEBAR_MODULES) {
    for (const sub of mod.sub_modules) {
      for (const scr of sub.screens) {
        if (scr.form_id === formId) return scr;
      }
    }
  }
  return HOME_SCREEN;
}

export interface BreadcrumbResolution {
  readonly module: SidebarModule;
  readonly sub: SidebarSubModule;
  readonly screen: SystemScreen;
}

export function getBreadcrumb(url: string): BreadcrumbResolution | null {
  const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
  if (!cleanUrl || cleanUrl === '/' || cleanUrl === '/dashboard') return null;

  for (const mod of SIDEBAR_MODULES) {
    for (const sub of mod.sub_modules) {
      for (const scr of sub.screens) {
        const cleanScreenRoute = scr.route.split('?')[0].replace(/\/+$/, '');
        if (cleanUrl === cleanScreenRoute || cleanUrl.startsWith(cleanScreenRoute + '/')) {
          return { module: mod, sub, screen: scr };
        }
      }
    }
  }
  return null;
}