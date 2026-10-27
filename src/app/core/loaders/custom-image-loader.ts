import { ImageLoaderConfig } from '@angular/common';

/**
 * Universal image loader for InfoAidTech.
 * Solves the critical Cloudinary 400 Bad Request error by avoiding duplicate base URLs,
 * gracefully handles absolute URLs, relative Cloudinary IDs, and external providers (Unsplash, local assets).
 */
export function customImageLoader(config: ImageLoaderConfig): string {
  const { src, width } = config;
  if (!src) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop';
  }

  // 1. If absolute URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // If it is a Cloudinary URL from InfoAidTech cloud account
    if (src.includes('res.cloudinary.com/dfcir8epp/image/upload/')) {
      // Avoid duplicate transformation if already present
      if (!src.includes('/image/upload/f_auto') && !src.includes('/image/upload/w_') && !src.includes('/image/upload/c_')) {
        const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
        return src.replace('/image/upload/', `/image/upload/${transform}/`);
      }
    }
    return src;
  }

  // 2. Local assets
  if (src.startsWith('assets/') || src.startsWith('/assets/')) {
    return src.startsWith('/') ? src : `/${src}`;
  }

  // 3. Relative Cloudinary asset ID (e.g. "v1755598681/infoaidtech-hero-img_jfmruv.webp")
  const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
  const cleanSrc = src.replace(/^\/+/, '');
  return `https://res.cloudinary.com/dfcir8epp/image/upload/${transform}/${cleanSrc}`;
}
