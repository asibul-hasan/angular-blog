import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";
import { TestimonialComponent } from "../../../shared/components/template/testimonial.component";
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service';

@Component({
  selector: 'app-about',
  imports: [UpperSectionComponent, TestimonialComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {

  constructor(private router: Router, private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object) {
    let origin = '';

    if (isPlatformBrowser(this.platformId)) {
      // ✅ Only access `window` in the browser
      origin = window.location.origin;
    }

    // use meta services
    this.seo.updateTags({
      title: 'Innovative IT & Digital Solutions Agency',
      description:
        'InfoAidTech is a leading IT and digital agency providing custom software development, web & app solutions, and digital marketing services to help businesses grow.',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin, // ✅ safe to pass (empty on server)
      type: 'website',
    });
  }
}
