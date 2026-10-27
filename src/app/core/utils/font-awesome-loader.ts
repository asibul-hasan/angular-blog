/**
 * Dynamically loads the Font Awesome CDN stylesheet on demand.
 * This ensures that initial landing page visits (e.g. Home, About, Contact)
 * are not burdened by 129 KiB of unused CSS and webfonts (fa-solid-900.woff2),
 * while preserving complete icon support when navigating to dashboards or forms.
 */
export function loadFontAwesome(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('font-awesome-cdn')) return;

  const link = document.createElement('link');
  link.id = 'font-awesome-cdn';
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  document.head.appendChild(link);
}
