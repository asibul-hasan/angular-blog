export interface MenuItem {
    id: string;
    title: string;
    iconClass: string;
    route?: string;
    children?: MenuItem[];
    requiresAdmin?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        iconClass: 'fa-solid fa-gauge',
        route: '/dashboard'
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