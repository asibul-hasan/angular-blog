import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private meta: Meta, private titleService: Title) {}

  updateTags({ title, description }: { title: string; description: string }) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'og:title', content: title });
    this.meta.updateTag({ name: 'og:description', content: description });
  }
}
