import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeroComponent } from '../../../shared/components/template/hero.component';
import { ChooseUs } from '../../../shared/components/template/choose-us.component';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { LanguageService } from '../../../shared/services/language/lang.service';
import { isPlatformBrowser } from '@angular/common';
import { TechCarouselComponent } from '../../../shared/components/template/tech-carousel.component';
import { TechIconCarouselComponent } from '../../../shared/components/template/tech-icon-carousel.component';
import { TechnologySectionComponent } from '../../../shared/components/template/technology-section.component';
import { ServiceSectionComponent } from '../../../shared/components/template/service-section.component';
import { TestimonialComponent } from '../../../shared/components/template/testimonial.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    TechIconCarouselComponent,
    ChooseUs,
    AboutSection,
    TechnologySectionComponent,
    ServiceSectionComponent,
    TestimonialComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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

    this.seo.updateTags({
      title: 'Enterprise Software Development & SME ERP Solutions',
      description:
        'InfoAidTech engineers custom software, scalable web applications, and specialized SME ERP systems (Aidly PMS) that automate business operations and drive commercial growth.',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      url: 'https://infoaidtech.net',
      type: 'website',
      keywords: 'custom software development, SME ERP Bangladesh, pharmacy management software, web application development, mobile app development, cloud consulting, Aidly ERP, InfoAidTech',
    });
  }
}
