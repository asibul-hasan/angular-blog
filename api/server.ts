import { resolve } from 'node:path';

// The SSR server build must exist at deploy time (built by "vercel-build").
// Dynamically import the ESM bundle to avoid CJS require issues with .mjs.
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
    await reqHandler(req as any, res as any);
  } catch (error) {
    console.error('SSR handler error:', error);
    res.status(500).send('SSR handler error');
  }
}
