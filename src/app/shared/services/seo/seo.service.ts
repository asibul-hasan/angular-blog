import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
  slug?: string; // blog post slug for canonical + og:url
  type?: string; // "article" or "website"
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private siteName = 'infoAidTech';
  private siteUrl = 'https://infoaidtech.net';
  private twitterHandle = '@mytwitter';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateTags(data: SeoData) {
    const fullTitle = data.title
      ? `${data.title} | ${this.siteName}`
      : this.siteName;
    const url = data.slug ? `${this.siteUrl}/blog/${data.slug}` : this.siteUrl;

    // ✅ Title
    this.title.setTitle(fullTitle);

    // ✅ Basic Meta
    this.meta.updateTag({
      name: 'description',
      content:
        data.description ||
        'Read latest articles and tutorials on My Angular Blog.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'InfoAidTech, IT services, software development, cloud solutions, digital transformation, IT consulting, technology solutions, enterprise IT, managed services"',
    });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: this.siteName });

    // ✅ Canonical (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.updateLinkTag('canonical', url);
    }

    // ✅ Open Graph
    this.meta.updateTag({
      property: 'og:type',
      content: data.type || 'article',
    });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({
      property: 'og:description',
      content: data.description || '',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: data.image || `${this.siteUrl}/assets/default-og.jpg`,
    });
    this.meta.updateTag({ property: 'og:url', content: url });

    // ✅ Twitter
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({
      name: 'twitter:description',
      content: data.description || '',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: data.image || `${this.siteUrl}/assets/default-og.jpg`,
    });
  }

  // Helper: Canonical tag (link rel="canonical")
  private updateLinkTag(rel: string, href: string) {
    if (!isPlatformBrowser(this.platformId)) return; // ✅ avoid SSR crash

    let element: HTMLLinkElement | null = this.doc.querySelector(
      `link[rel='${rel}']`
    );
    if (!element) {
      element = this.doc.createElement('link');
      element.setAttribute('rel', rel);
      this.doc.head.appendChild(element);
    }
    element.setAttribute('href', href);
  }
}
