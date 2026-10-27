import {
  ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { ContactService, ContactMessage } from '../../../shared/services/contact/contact.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UpperSectionComponent, ReactiveFormsModule, CommonModule, RouterLink],
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

  isSubmitting = false;

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    serviceInterest: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly requiredFields = ['name', 'email', 'subject', 'serviceInterest', 'message'];

  readonly quickInfo = [
    { icon: 'fa-regular fa-envelope', label: 'Direct Email', value: 'info@infoaidtech.net', href: 'mailto:info@infoaidtech.net' },
    { icon: 'fa-brands fa-whatsapp', label: 'Instant Chat', value: '+880 1832-824147', href: 'https://wa.me/8801832824147' },
    { icon: 'fa-solid fa-location-dot', label: 'Office Coordinates', value: 'Dhaka, Bangladesh', href: '#' },
    { icon: 'fa-solid fa-bolt', label: 'Response Protocol', value: 'Guaranteed < 24 Hours', href: '#' },
  ];

  readonly officeHours = [
    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  readonly serviceOptions = [
    { value: 'Custom Software & ERP', label: 'Custom Software & SME ERP (Aidly)' },
    { value: 'Web & Cloud Development', label: 'Full-Stack Web & Cloud Infrastructure' },
    { value: 'Mobile App Development', label: 'Mobile Applications (iOS & Android)' },
    { value: 'AI & Machine Learning', label: 'AI, LLM Integration & Automation' },
    { value: 'UI/UX & Product Design', label: 'UI/UX Product Architecture & Design' },
    { value: 'Technical Consultation', label: 'Technical Architecture & Advisory' },
    { value: 'Other Inquiries', label: 'Other General Inquiry / Partnership' },
  ];

  readonly faqs = [
    {
      q: 'How quickly can InfoAidTech begin work on our project?',
      a: 'We typically initiate discovery and architectural scoping within 3–5 business days following requirement alignment. Sprints are kicked off immediately after roadmap consensus.'
    },
    {
      q: 'Do you sign Non-Disclosure Agreements (NDAs)?',
      a: 'Yes, absolutely. We treat intellectual property with enterprise confidentiality. We are happy to execute standard or custom mutual NDAs prior to in-depth technical discussions.'
    },
    {
      q: 'What engagement models do you offer?',
      a: 'We provide flexible collaboration structures: fixed-scope milestone projects, dedicated engineering pods, and time-and-materials arrangements tailored to startup and enterprise budgets.'
    },
    {
      q: 'Do you offer post-launch SLA and continuous maintenance?',
      a: 'Yes. Every production delivery is supported by dedicated warranty windows and modular maintenance SLAs covering 24/7 telemetry monitoring, security patching, and iterative feature scaling.'
    },
  ];

  readonly openFaqIndex = signal<number | null>(0);

  toggleFaq(index: number) {
    this.openFaqIndex.update(cur => cur === index ? null : index);
  }

  get completedRequiredCount(): number {
    let count = 0;
    for (const field of this.requiredFields) {
      const val = this.contactForm.get(field)?.value;
      if (val && typeof val === 'string' && val.trim().length > 0) {
        if (this.contactForm.get(field)?.valid) {
          count++;
        }
      }
    }
    return count;
  }

  get totalRequiredCount(): number {
    return this.requiredFields.length;
  }

  get completionPercentage(): number {
    return Math.round((this.completedRequiredCount / this.totalRequiredCount) * 100);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    return 'Invalid input';
  }

  constructor() {
    this.seo.updateTags({
      title: 'Contact InfoAidTech — Custom Software & SME Solutions',
      description: 'Get in touch with InfoAidTech for custom software engineering, SME ERP systems (Aidly PMS), web solutions, and digital strategy.',
      image: 'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      url: 'https://infoaidtech.net/contact',
      type: 'website',
      keywords: 'contact InfoAidTech, software consultation, get in touch, Aidly ERP inquiry',
    });

    this.seo.addBreadcrumbs([
      { name: 'Home', url: 'https://infoaidtech.net/' },
      { name: 'Contact', url: 'https://infoaidtech.net/contact' }
    ]);

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact InfoAidTech',
      url: 'https://infoaidtech.net/contact',
      description: 'Get in touch with InfoAidTech for custom software engineering, web solutions, and SME ERP implementations.',
      mainEntity: {
        '@type': 'Organization',
        name: 'InfoAidTech',
        url: 'https://infoaidtech.net',
        email: 'info@infoaidtech.net',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support & Sales',
          email: 'info@infoaidtech.net',
          availableLanguage: ['English', 'Bengali']
        }
      }
    }, 'contact-page');

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a
        }
      }))
    }, 'contact-faq');
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const formVal = this.contactForm.value;
      const contactMessage: ContactMessage = {
        name: formVal.name || '',
        email: formVal.email || '',
        phone: formVal.phone || '',
        subject: formVal.subject || '',
        serviceInterest: formVal.serviceInterest || '',
        message: formVal.message || '',
      };

      if (isPlatformBrowser(this.platformId)) {
        contactMessage.companyUrl = window.location.origin;
      }

      this.contactService.sendContactMessage(contactMessage).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.toast.success('Message Dispatched', res.message || 'Your message has been sent successfully! Our team will get back to you shortly.');
          this.contactForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error sending contact message:', err);
          this.toast.error('Transmission Error', err?.error?.message || 'Failed to send your message. Please try again or email us directly.');
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.toast.warn('Incomplete Information', 'Please complete all required fields marked with *.');
    }
  }
}