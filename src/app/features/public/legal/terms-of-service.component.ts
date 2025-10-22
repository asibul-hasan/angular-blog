import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service'; // Adjust path as needed
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, UpperSectionComponent],
  template: `
  <app-upper-section [title]="'Terms of Service'"></app-upper-section>

     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-16 lg:py-20">

      <div class=" shadow-lg rounded-lg p-8">
        <!-- <h1 class="text-4xl font-bold text-light-900 mb-6">Terms and Conditions of Use</h1> -->
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">1. Terms</h2>
          <p class="text-light-600">
            By accessing this website, accessible from <a href="https://infoaidtech.net" class="text-blue-600 hover:text-blue-800 underline">infoaidtech.net</a>, 
            you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with 
            any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained 
            in this website are protected by copyright and trademark law.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">2. Use License</h2>
          <p class="text-light-600 mb-4">
            Permission is granted to temporarily download one copy of the materials on InfoaidTech's website for personal, non-commercial transitory 
            viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul class="list-disc list-inside text-light-600 space-y-2 ml-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display;</li>
            <li>Attempt to reverse engineer any software contained on InfoaidTech's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p class="text-light-600 mt-4">
            This will let InfoaidTech terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be 
            terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">3. Disclaimer</h2>
          <p class="text-light-600">
            All the materials on InfoaidTech's website are provided "as is". InfoaidTech makes no warranties, may it be expressed or implied, 
            therefore negates all other warranties. Furthermore, InfoaidTech does not make any representations concerning the accuracy or reliability 
            of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">4. Limitations</h2>
          <p class="text-light-600">
            InfoaidTech or its suppliers will not be held accountable for any damages that will arise with the use or inability to use the materials 
            on InfoaidTech's website, even if InfoaidTech or an authorized representative of this website has been notified, orally or written, of 
            the possibility of such damage. Some jurisdictions do not allow limitations on implied warranties or limitations of liability for incidental 
            damages, these limitations may not apply to you.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">5. Revisions and Errata</h2>
          <p class="text-light-600">
            The materials appearing on InfoaidTech's website may include technical, typographical, or photographic errors. InfoaidTech will not promise 
            that any of the materials in this website are accurate, complete, or current. InfoaidTech may change the materials contained on its website 
            at any time without notice. InfoaidTech does not make any commitment to update the materials.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">6. Links</h2>
          <p class="text-light-600">
            InfoaidTech has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The 
            presence of any link does not imply endorsement by InfoaidTech of the site. The use of any linked website is at the user's own risk.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">7. Site Terms of Use Modifications</h2>
          <p class="text-light-600">
            InfoaidTech may revise these Terms of Use for its website at any time without prior notice. By using this website, you are agreeing to be 
            bound by the current version of these Terms and Conditions of Use.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">8. Governing Law</h2>
          <p class="text-light-600">
            Any claim related to InfoaidTech's website shall be governed by the laws of Bangladesh without regards to its conflict of law provisions.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">9. Contact Information</h2>
          <p class="text-light-600">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div class="mt-4 bg-light-100 p-4 rounded-lg">
            <p class="text-light-700"><strong>Email:</strong> <a href="mailto:info@infoaidtech.net" class="text-blue-600 hover:text-blue-800 underline">info&#64;infoaidtech.net</a></p>
            <p class="text-light-700"><strong>Website:</strong> <a href="https://infoaidtech.net" class="text-blue-600 hover:text-blue-800 underline">infoaidtech.net</a></p>
            <p class="text-light-700"><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/infoaidtech" class="text-blue-600 hover:text-blue-800 underline">linkedin.com/company/infoaidtech</a></p>
          </div>
        </section>

        <div class="mt-12 pt-6 border-t border-light-200">
          <p class="text-sm text-light-500">
            Last updated: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TermsOfServiceComponent {
  lastUpdated: string = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let origin = '';

    if (isPlatformBrowser(this.platformId)) {
      origin = window.location.origin;
    }

    // Update SEO meta tags for Terms of Service
    this.seo.updateTags({
      title: 'Terms of Service - InfoaidTech | Terms & Conditions',
      description:
        'Review InfoaidTech\'s Terms of Service and Conditions of Use. Understand your rights and responsibilities when using our IT services, website, and digital solutions.',
      keywords: 'terms of service, terms and conditions, user agreement, website terms, service terms, legal terms, InfoaidTech terms, usage policy, terms of use',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: `${origin}/terms-of-service`,
      type: 'website',
    });
  }
}