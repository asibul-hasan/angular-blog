import { Environment } from './environment.d';

export const environment: Environment = {
  production: false,

  // Use the production API endpoint for development
  // apiUrl: 'https://infoaidtech.vercel.app/api',
  apiUrl: 'http://localhost:3000/api',

  SITE_URL: 'https://infoaidtech.net',

  // Hugging Face API Token (Used on backend to avoid CORS issues)
  huggingFaceToken: ''
};