import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { UpperSectionComponent } from "../../../shared/components/template/cards/page-upper-section.component";


@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, UpperSectionComponent],
  template: `
    <app-upper-section [title]="'Privacy Policy'"></app-upper-section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-16 lg:py-20">

      <div class=" shadow-lg rounded-lg p-8">
        <!-- <h1 class="text-4xl font-bold text-light-900 mb-6">Privacy Policy</h1> -->
        
        <p class="text-light-600 mb-6">
          At InfoaidTech, accessible at <a href="https://infoaidtech.net" class="text-blue-600 hover:text-blue-800 underline">infoaidtech.net</a>, 
          one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information 
          that is collected and recorded by InfoaidTech and how we use it.
        </p>

        <p class="text-light-600 mb-8">
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us 
          through email at <a href="mailto:info@infoaidtech.net" class="text-blue-600 hover:text-blue-800 underline">info&#64;infoaidtech.net</a>
        </p>

        <p class="text-light-600 mb-8">
          This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the 
          information that they shared and/or collect in InfoaidTech. This policy is not applicable to any information collected 
          offline or via channels other than this website.
        </p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Consent</h2>
          <p class="text-light-600">
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Information We Collect</h2>
          <p class="text-light-600 mb-4">
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made 
            clear to you at the point we ask you to provide your personal information.
          </p>
          <p class="text-light-600 mb-4">
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, 
            the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
          <p class="text-light-600">
            When you register for an Account, we may ask for your contact information, including items such as name, company name, 
            address, email address, and telephone number.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">How We Use Your Information</h2>
          <p class="text-light-600 mb-4">We use the information we collect in various ways, including to:</p>
          <ul class="list-disc list-inside text-light-600 space-y-2 ml-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Log Files</h2>
          <p class="text-light-600">
            InfoaidTech follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting 
            companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol 
            (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the 
            number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is 
            for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Cookies and Web Beacons</h2>
          <p class="text-light-600 mb-4">
            Like any other website, InfoaidTech uses 'cookies'. These cookies are used to store information including visitors' preferences, 
            and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by 
            customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">DoubleClick DART Cookie</h2>
          <p class="text-light-600 mb-4">
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors 
            based upon their visit to infoaidtech.net and other sites on the internet. However, visitors may choose to decline the use of DART 
            cookies by visiting the Google ad and content network Privacy Policy at the following URL – 
            <a href="https://policies.google.com/technologies/ads" class="text-blue-600 hover:text-blue-800 underline" target="_blank">https://policies.google.com/technologies/ads</a>.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Advertising Partners Privacy Policies</h2>
          <p class="text-light-600 mb-4">
            You may consult this list to find the Privacy Policy for each of the advertising partners of InfoaidTech.
          </p>
          <p class="text-light-600 mb-4">
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective 
            advertisements and links that appear on InfoaidTech, which are sent directly to users' browser. They automatically receive your IP 
            address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize 
            the advertising content that you see on websites that you visit.
          </p>
          <p class="text-light-600 mb-4">
            Note that InfoaidTech has no access to or control over these cookies that are used by third-party advertisers.
          </p>
          <div class="bg-light-100 p-4 rounded-lg">
            <h3 class="font-semibold text-light-900 mb-2">Google</h3>
            <a href="https://policies.google.com/technologies/ads" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
              https://policies.google.com/technologies/ads
            </a>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Third-Party Privacy Policies</h2>
          <p class="text-light-600 mb-4">
            InfoaidTech's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective 
            Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about 
            how to opt-out of certain options.
          </p>
          <p class="text-light-600">
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management 
            with specific web browsers, it can be found at the browsers' respective websites.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">CCPA Privacy Policy (Do Not Sell My Personal Information)</h2>
          <p class="text-light-600 mb-4">Under the CCPA, among other rights, California consumers have the right to:</p>
          <ul class="list-disc list-inside text-light-600 space-y-2 ml-4">
            <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
          </ul>
          <p class="text-light-600 mt-4">
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">GDPR Privacy Policy (Data Protection Rights)</h2>
          <p class="text-light-600 mb-4">
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul class="list-disc list-inside text-light-600 space-y-2 ml-4">
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p class="text-light-600 mt-4">
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-light-900 mb-4">Children's Information</h2>
          <p class="text-light-600 mb-4">
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to 
            observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p class="text-light-600">
            InfoaidTech does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that 
            your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our 
            best efforts to promptly remove such information from our records.
          </p>
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
export class PrivacyPolicyComponent {
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

    // Update SEO meta tags for Privacy Policy
    this.seo.updateTags({
      title: 'Privacy Policy - InfoaidTech | Data Protection & Privacy',
      description:
        'Read InfoaidTech\'s Privacy Policy to understand how we collect, use, and protect your personal information. Learn about our data protection practices, GDPR & CCPA compliance, and your privacy rights.',
      // keywords: 'privacy policy, data protection, GDPR, CCPA, personal information, cookies policy, InfoaidTech privacy, data security, user privacy rights',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: `${origin}/privacy-policy`,
      type: 'website',
    });
  }
}