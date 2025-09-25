import { resolve } from 'node:path';

// Vercel serverless function entrypoint that delegates to the built Angular SSR handler.
export default async function handler(req: any, res: any) {
  try {
    const serverEntry = resolve(
      process.cwd(),
      'dist/infoAidTech/server/server.mjs'
    );
    const mod = await import(serverEntry);
    const reqHandler = mod.reqHandler as (
      req: any,
      res: any
    ) => Promise<void> | void;
    await reqHandler(req, res);
  } catch (error) {
    console.error('SSR handler error:', error);
    res.status(500).send('SSR handler error');
  }
}
