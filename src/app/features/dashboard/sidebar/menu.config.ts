export interface MenuItem {
    id: string;
    title: string;
    iconClass: string;
    route?: string;
    children?: MenuItem[];
    requiresAdmin?: boolean;
    requiresIntern?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        iconClass: 'fa-solid fa-gauge',
        route: '/dashboard',
        requiresAdmin: true
    },
    {
        id: 'intern-tasks',
        title: 'My Tasks',
        iconClass: 'fa-solid fa-list-check',
        route: '/dashboard/intern/tasks',
        requiresIntern: true
    },
    {
        id: 'blog-management',
        title: 'Blog Management',
        iconClass: 'fa-solid fa-blog',
        requiresAdmin: true,
        children: [
            {
                id: 'blogs',
                title: 'Blogs',
                iconClass: 'fa-solid fa-newspaper',
                route: '/dashboard/blog-management/blogs'
            },
            {
                id: 'create-blog',
                title: 'Create Blog',
                iconClass: 'fa-solid fa-plus',
                route: '/dashboard/blog-management/blog/create'
            },
            {
                id: 'categories',
                title: 'Categories',
                iconClass: 'fa-solid fa-tags',
                route: '/dashboard/blog-management/categories'
            }
        ]
    },
    {
        id: 'job-management',
        title: 'Job Management',
        iconClass: 'fa-solid fa-briefcase',
        requiresAdmin: true,
        children: [
            {
                id: 'jobs',
                title: 'Jobs',
                iconClass: 'fa-solid fa-list',
                route: '/dashboard/job-management/jobs'
            },
            {
                id: 'create-job',
                title: 'Create Job',
                iconClass: 'fa-solid fa-plus',
                route: '/dashboard/job-management/job/create'
            },
            {
                id: 'applications',
                title: 'Applications',
                iconClass: 'fa-solid fa-file-contract',
                route: '/dashboard/job-management/job-applications'
            },
            {
                id: 'internship',
                title: 'Internship',
                iconClass: 'fa-solid fa-briefcase',
                route: '/dashboard/internship'
            }
        ]
    },
    {
        id: 'intern-management',
        title: 'Intern Management',
        iconClass: 'fa-solid fa-user-graduate',
        requiresAdmin: true,
        children: [
            {
                id: 'intern-list',
                title: 'Track Interns',
                iconClass: 'fa-solid fa-list-ol',
                route: '/dashboard/intern-management/list'
            },
            {
                id: 'domain-tasks',
                title: 'Domain Tasks',
                iconClass: 'fa-solid fa-network-wired',
                route: '/dashboard/intern-management/domain-tasks'
            },
            {
                id: 'task-review',
                title: 'Review Tasks',
                iconClass: 'fa-solid fa-check-double',
                route: '/dashboard/intern-management/task-review'
            }
        ]
    },
    {
        id: 'user-management',
        title: 'User Management',
        iconClass: 'fa-solid fa-users',
        requiresAdmin: true,
        children: [
            {
                id: 'users',
                title: 'Users',
                iconClass: 'fa-solid fa-user-group',
                route: '/dashboard/user-management/users'
            },
            {
                id: 'my-profile',
                title: 'My Profile',
                iconClass: 'fa-solid fa-user',
                route: '/dashboard/user-management/my-profile'
            }
        ]
    },
    {
        id: 'settings',
        title: 'Settings',
        iconClass: 'fa-solid fa-gear',
        requiresAdmin: true,
        children: [
            {
                id: 'company-management',
                title: 'Company Management',
                iconClass: 'fa-solid fa-building',
                route: '/dashboard/settings/company-management'
            },
            {
                id: 'user-access-management',
                title: 'User Access Management',
                iconClass: 'fa-solid fa-user-shield',
                route: '/dashboard/settings/user-access-management'
            },
            {
                id: 'module-access-management',
                title: 'Module Access Management',
                iconClass: 'fa-solid fa-key',
                route: '/dashboard/settings/module-access-management'
            }
        ]
    }
];