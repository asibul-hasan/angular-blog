import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SocialLinksService } from '../../services/social-links/social-links.service';

@Component({
  selector: `app-social-icon`,
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex space-x-4 text-gray-400 mb-8">
      <!-- faceBook -->
      <a
        *ngFor="let icon of socialLinks"
        href="{{ icon.url }}"
        target="_blank"
        class="hover:text-white transition duration-300"
        [attr.aria-label]="'Visit our ' + icon.name + ' page'"
      >
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path [attr.d]="icon.svgpath"></path>
        </svg>
      </a>
    </div>
  `,
})
export class SocialIcon implements OnInit {
  socialLinks: any = [];

  constructor(private socialLinksService: SocialLinksService) {
    this.socialLinks = this.socialLinksService.getSocialLinks();
  }

  ngOnInit(): void {}
}
