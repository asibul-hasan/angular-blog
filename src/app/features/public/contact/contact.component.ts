import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { SocialIcon } from "../../../shared/components/template/social-icon-card.component";

@Component({
  selector: 'app-contact',
  imports: [UpperSectionComponent, SocialIcon],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {

  constructor(private router: Router, private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object) {
    let origin = '';

    if (isPlatformBrowser(this.platformId)) {
      // ✅ Only access `window` in the browser
      origin = window.location.origin;
    }

    // use meta services
    this.seo.updateTags({
      title: 'Your IT & Digital Solutions Partner',
      description:
        'Get in touch with InfoAidTech, a trusted IT and digital agency, for custom software, web solutions, and digital marketing strategies tailored to your business needs.',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin, // ✅ safe to pass (empty on server)
      type: 'website',
    });
  }
}
