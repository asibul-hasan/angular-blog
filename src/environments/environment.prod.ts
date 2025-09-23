export const environment = {
  production: true,

  // blogsApiBaseUrl: 'http://localhost:3000/api/blog',
  blogsApiBaseUrl: 'https://infoaidtech.vercel.app/api/blog',
  //   SITE_URL: 'http://localhost:5000/',
  apiUrl: 'https://infoaidtech.vercel.app/api/blog',
  SITE_URL: 'https://infoaidtech.net',
  endpoints: [
    {
      blog: 'blog',
      actions: {
        get: 'get-blog-list',
        getById: 'get-blog',
        update: 'edit-blog', //put
        post: 'create-blog',
        delete: 'delete-blog',
      },
    },
    {
      category: {
        get: 'get-categories',
      },
    },
  ],
};
// export const environment = {
//   production: true,
//   apiUrl: 'https://infoaidtech.vercel.app/api',
//   SITE_URL: 'https://your-cpanel-domain.com' // Replace with your actual domain
// };
