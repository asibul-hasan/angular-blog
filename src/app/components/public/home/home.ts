import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeroComponent } from '../../../shared/components/template/hero';
import { ChooseUs } from '../../../shared/components/template/choose-us';
import { AboutSection } from '../../../shared/components/template/about-section';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { LanguageService } from '../../../shared/services/language/lang.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ChooseUs, AboutSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private seo: SeoService,
    private langService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let origin = '';

    if (isPlatformBrowser(this.platformId)) {
      // ✅ Only access `window` in the browser
      origin = window.location.origin;
    }

    // use meta services
    this.seo.updateTags({
      title: 'Revolutionizing IT Services for a Digital Era',
      description:
        'Welcome to InfoAidTech – Your trusted IT partner. We specialize in digital transformation, cloud solutions, software development, and IT consulting. Where vision meets expertise, InfoAidTech delivers innovation and reliability.',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin, // ✅ safe to pass (empty on server)
      type: 'Software Development',
    });
  }
}
