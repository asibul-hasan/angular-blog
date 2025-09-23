export const environment = {
  production: false,

  // blogsApiBaseUrl: 'http://localhost:3000/api/blog',
  blogsApiBaseUrl: 'https://infoaidtech.vercel.app/api/blog',
  apiUrl: 'https://infoaidtech.vercel.app/api/blog',

  //   SITE_URL: 'http://localhost:5000/',

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
