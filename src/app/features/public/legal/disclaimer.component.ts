import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule, UpperSectionComponent],
  template: `
  <app-upper-section [title]="'Disclaimer'"></app-upper-section>

  <section class="py-16 lg:py-20  min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
        <!-- <h1 class="text-4xl font-bold text-light-900 mb-6">Disclaimer</h1> -->
        
        <p class="text-gray-300 mb-8">
          If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at 
          <a href="mailto:info@infoaidtech.net" class="text-[#f76179] hover:text-[#1e3e62] underline">info&#64;infoaidtech.net</a>.
        </p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">General Disclaimer for InfoaidTech</h2>
          <p class="text-gray-300 mb-4">
            All the information on this website – <a href="https://infoaidtech.net" class="text-[#f76179] hover:text-[#1e3e62] underline">infoaidtech.net</a> – 
            is published in good faith and for general information purpose only. InfoaidTech does not make any warranties about the completeness, 
            reliability and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk. 
            InfoaidTech will not be liable for any losses and/or damages in connection with the use of our website.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">External Links Disclaimer</h2>
          <p class="text-gray-300 mb-4">
            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links 
            to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a 
            recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the 
            opportunity to remove a link which may have gone 'bad'.
          </p>
          <p class="text-gray-300">
            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. 
            Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading 
            any information.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">Professional Advice Disclaimer</h2>
          <p class="text-gray-300">
            The information provided on InfoaidTech is for general informational purposes only. All information on the site is provided in good faith, 
            however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, 
            availability or completeness of any information on the site.
          </p>
          <div class="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p class="text-yellow-800">
              <strong>Important:</strong> Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result 
              of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the 
              site is solely at your own risk.
            </p>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">No Responsibility Disclaimer</h2>
          <p class="text-gray-300">
            The information on this website is provided with the understanding that InfoaidTech is not herein engaged in rendering legal, accounting, tax, 
            or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, 
            legal or other competent advisers.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">"Use at Your Own Risk" Disclaimer</h2>
          <p class="text-gray-300">
            All information on InfoaidTech is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the 
            use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, 
            merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">Consent</h2>
          <p class="text-gray-300">
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">Updates</h2>
          <p class="text-gray-300">
            Should we update, amend or make any changes to this document, those changes will be prominently posted here.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p class="text-gray-300 mb-4">
            If you have any questions or concerns about this disclaimer, please contact us:
          </p>
          <div class="bg-white/5 p-4 rounded-lg border border-white/10">
            <p class="text-gray-300"><strong>Company Name:</strong> InfoaidTech</p>
            <p class="text-gray-300"><strong>Email:</strong> <a href="mailto:info@infoaidtech.net" class="text-[#f76179] hover:text-[#1e3e62] underline">info&#64;infoaidtech.net</a></p>
            <p class="text-gray-300"><strong>Website:</strong> <a href="https://infoaidtech.net" class="text-[#f76179] hover:text-[#1e3e62] underline">infoaidtech.net</a></p>
            <p class="text-gray-300"><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/infoaidtech" class="text-[#f76179] hover:text-[#1e3e62] underline">linkedin.com/company/infoaidtech</a></p>
          </div>
        </section>

        <div class="mt-12 pt-6 border-t border-white/10">
          <p class="text-sm text-gray-400">
            Last updated: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: []
})
export class DisclaimerComponent {
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

    this.seo.updateTags({
      title: 'Disclaimer - InfoAidTech | Legal Notice',
      description:
        'Read InfoAidTech’s Disclaimer to understand the limitations of liability, warranties, and accuracy of the information provided on our website and services.',
      keywords:
        'disclaimer, infoaidtech disclaimer, legal notice, liability statement, website disclaimer, accuracy disclaimer, IT service disclaimer, terms of use, legal responsibility',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: `${origin}/disclaimer`,
      type: 'website',
    });
  }
}