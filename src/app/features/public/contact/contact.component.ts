import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { AboutSection } from '../../../shared/components/template/about-section.component';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { SocialIcon } from "../../../shared/components/template/social-icon-card.component";
import { ContactService, ContactMessage } from '../../../shared/services/contact/contact.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-contact',
  imports: [UpperSectionComponent, SocialIcon, ...SHARED_IMPORTS],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private router: Router,
    private seo: SeoService,
    private contactService: ContactService,
    private fb: FormBuilder,
    private toast: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
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

    // Initialize form
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactMessage: ContactMessage = this.contactForm.value;

      // Add company URL if available
      if (isPlatformBrowser(this.platformId)) {
        contactMessage.companyUrl = window.location.origin;
      }

      this.contactService.sendContactMessage(contactMessage).subscribe({
        next: (response) => {
          this.toast.success('Success', 'Your message has been sent successfully!');
          this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error sending contact message:', error);
          this.toast.error('Error', 'Failed to send your message. Please try again later.');
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.toast.warn('Validation', 'Please fill in all required fields correctly.');
    }
  }
}