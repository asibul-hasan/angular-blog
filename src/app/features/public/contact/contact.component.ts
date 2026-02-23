import {
  ChangeDetectionStrategy, Component, inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { SocialIcon } from '../../../shared/components/template/social-icon-card.component';
import { ContactService, ContactMessage } from '../../../shared/services/contact/contact.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-contact',
  imports: [UpperSectionComponent, ReactiveFormsModule, ...SHARED_IMPORTS],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly seo = inject(SeoService);
  private readonly contactService = inject(ContactService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    serviceInterest: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly quickInfo = [
    { icon: '📧', label: 'Email', value: 'info@infoaidtech.net' },
    { icon: '⏱️', label: 'Response Time', value: 'Within 24 hours' },
    { icon: '🌐', label: 'Available', value: 'Mon – Fri, 9AM – 6PM' },
  ];

  readonly contactDetails = [
    { icon: '📧', label: 'Email', value: 'info@infoaidtech.net', href: 'mailto:info@infoaidtech.net' },
    { icon: '🌐', label: 'Website', value: 'www.infoaidtech.net', href: 'https://www.infoaidtech.net' },
    { icon: '📍', label: 'Location', value: 'Dhaka, Bangladesh', href: '#' },
  ];

  readonly officeHours = [
    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  readonly serviceOptions = [
    'Web Development', 'Mobile App Development', 'UI/UX Design',
    'Cloud & DevOps', 'AI / Machine Learning', 'Digital Marketing',
    'Custom Software', 'Tech Consultation', 'Other',
  ];

  readonly faqs = [
    { q: 'How quickly can you start my project?', a: 'We typically kick off new projects within 1-2 weeks of contract signing, depending on our current capacity.' },
    { q: 'Do you offer post-launch support?', a: 'Absolutely. We provide ongoing maintenance, updates, and technical support packages for all delivered projects.' },
    { q: 'What is your development process?', a: 'We follow agile methodology with 2-week sprints, regular demos, and continuous client feedback integration.' },
    { q: 'Do you work with international clients?', a: 'Yes! We work with clients worldwide and are comfortable with different time zones and remote collaboration tools.' },
  ];

  constructor() {
    const origin = isPlatformBrowser(this.platformId) ? window.location.origin : '';
    this.seo.updateTags({
      title: 'Contact InfoAidTech — Your IT & Digital Solutions Partner',
      description: 'Get in touch with InfoAidTech for custom software, web solutions, and digital marketing strategies tailored to your business needs.',
      image: 'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin,
      type: 'website',
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactMessage = this.contactForm.value as ContactMessage;
      if (isPlatformBrowser(this.platformId)) {
        contactMessage.companyUrl = window.location.origin;
      }
      this.contactService.sendContactMessage(contactMessage).subscribe({
        next: () => {
          this.toast.success('Success', 'Your message has been sent successfully!');
          this.contactForm.reset();
        },
        error: (err) => {
          console.error('Error sending contact message:', err);
          this.toast.error('Error', 'Failed to send your message. Please try again later.');
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.toast.warn('Validation', 'Please fill in all required fields correctly.');
    }
  }
}