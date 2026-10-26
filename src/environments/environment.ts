import { Environment } from './environment.d';

export const environment: Environment = {
  production: false,

  // Local API endpoint for development
  apiUrl: 'http://localhost:3000/api',
  // apiUrl: 'https://infoaidtech.vercel.app/api',

  SITE_URL: 'https://infoaidtech.net',

  // Hugging Face API Token (Used on backend to avoid CORS issues)
  huggingFaceToken: '',
};
