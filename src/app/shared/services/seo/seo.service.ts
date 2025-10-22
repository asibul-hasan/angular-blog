import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  slug?: string;
  type?: 'article' | 'website';
  author?: string;
  publishedDate?: string; // ISO format
  modifiedDate?: string;  // ISO format
  tags?: string[];
  locale?: string;
  readingTime?: string;
  relatedUrls?: string[]; // optional "see also" URLs
  keywords?: string; // optional keywords
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private siteName = 'infoAidTech';
  private siteUrl = 'https://infoaidtech.net';
  private twitterHandle = '@mytwitter';
  private defaultImage = `${this.siteUrl}/assets/default-og.jpg`;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /** Main method to update SEO tags dynamically */
  updateTags(data: SeoData) {
    const fullTitle = data.title ? `${data.title} | ${this.siteName}` : this.siteName;
    const url = data.slug ? `${this.siteUrl}/blog/${data.slug}` : this.siteUrl;
    const description = data.description || 'Professional IT services, software development, and cloud solutions by InfoAidTech.';
    const image = data.image || this.defaultImage;
    const locale = data.locale || 'en_US';

    // ✅ Title
    this.title.setTitle(fullTitle);

    // ✅ Basic Meta
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: data.author || this.siteName });
    this.meta.updateTag({ name: 'language', content: 'English' });
    this.meta.updateTag({ httpEquiv: 'content-language', content: locale.replace('_', '-') });

    // ✅ Keywords
    // ✅ Keywords (merged from tags[] and optional keywords)
    const keywords =
      data.keywords ||
      (data.tags?.length ? data.tags.join(', ') : undefined);

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }


    // ✅ Mobile Optimization
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.meta.updateTag({ name: 'theme-color', content: '#1a202c' });

    // ✅ Canonical (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.updateLinkTag('canonical', url);
    }

    // ✅ Open Graph
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: data.imageAlt || data.title || this.siteName });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: locale });

    if (data.modifiedDate) {
      this.meta.updateTag({ property: 'og:updated_time', content: data.modifiedDate });
    }

    if (data.relatedUrls?.length) {
      data.relatedUrls.forEach(link => {
        this.meta.updateTag({ property: 'og:see_also', content: link });
      });
    }

    // ✅ Article-specific OG tags
    if (data.type === 'article') {
      if (data.publishedDate) {
        this.meta.updateTag({ property: 'article:published_time', content: data.publishedDate });
      }
      if (data.modifiedDate) {
        this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedDate });
      }
      if (data.author) {
        this.meta.updateTag({ property: 'article:author', content: data.author });
      }
      if (data.tags?.length) {
        this.meta.updateTag({ property: 'article:section', content: data.tags[0] });
        data.tags.forEach(tag => {
          this.meta.updateTag({ property: 'article:tag', content: tag });
        });
      }
    }

    // ✅ Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: data.imageAlt || data.title || this.siteName });

    // ✅ Twitter enhanced info
    if (data.readingTime) {
      this.meta.updateTag({ name: 'twitter:label1', content: 'Reading time' });
      this.meta.updateTag({ name: 'twitter:data1', content: data.readingTime });
    }

    // ✅ JSON-LD Structured Data
    if (isPlatformBrowser(this.platformId)) {
      this.setJsonLd(this.generateStructuredData(data, fullTitle, url, description, image, locale));
    }
  }

  /** Generate JSON-LD structured data */
  private generateStructuredData(
    data: SeoData,
    fullTitle: string,
    url: string,
    description: string,
    image: string,
    locale: string
  ) {
    const baseSchema: any = {
      '@context': 'https://schema.org',
      '@type': data.type === 'article' ? 'BlogPosting' : 'WebSite',
      name: fullTitle,
      url,
      description,
      image,
      inLanguage: locale.replace('_', '-'),
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.siteUrl}/assets/logo.png`
        }
      },
      potentialAction: {
        '@type': 'ReadAction',
        target: [url]
      }
    };

    if (data.type === 'article') {
      return {
        ...baseSchema,
        headline: data.title,
        datePublished: data.publishedDate,
        dateModified: data.modifiedDate || data.publishedDate,
        author: {
          '@type': 'Person',
          name: data.author || this.siteName
        },
        keywords: data.tags?.join(', '),
        ...(data.readingTime && { timeRequired: data.readingTime }),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        }
      };
    }

    return baseSchema;
  }

  /** Insert or update JSON-LD <script> tag */
  private setJsonLd(schema: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    let script: HTMLScriptElement | null = this.doc.querySelector('script[type="application/ld+json"]:not([data-schema])');

    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  /** Helper: Update or create link tags */
  private updateLinkTag(rel: string, href: string, attrs: Record<string, string> = {}) {
    if (!isPlatformBrowser(this.platformId)) return;

    let element: HTMLLinkElement | null = this.doc.querySelector(`link[rel='${rel}']`);

    if (!element) {
      element = this.doc.createElement('link');
      element.setAttribute('rel', rel);
      this.doc.head.appendChild(element);
    }

    element.setAttribute('href', href);

    Object.entries(attrs).forEach(([key, value]) => {
      element!.setAttribute(key, value);
    });
  }

  /** Add breadcrumb structured data */
  addBreadcrumbs(items: Array<{ name: string; url: string }>) {
    if (!isPlatformBrowser(this.platformId)) return;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };

    let script: HTMLScriptElement | null = this.doc.querySelector('script[type="application/ld+json"][data-schema="breadcrumb"]');

    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'breadcrumb');
      this.doc.head.appendChild(script);
    }

    script.textContent = JSON.stringify(breadcrumbSchema);
  }

  /** Add preconnect hints for performance */
  addPreconnect(domains: string[]) {
    if (!isPlatformBrowser(this.platformId)) return;

    domains.forEach(domain => {
      const existing = this.doc.querySelector(`link[rel="preconnect"][href="${domain}"]`);
      if (!existing) {
        const link = this.doc.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        this.doc.head.appendChild(link);
      }
    });
  }

  /** Cleanup helper */
  clearTags() {
    this.meta.removeTag('name="description"');
    this.meta.removeTag('name="keywords"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
  }
}
