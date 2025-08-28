import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogApiService } from '../../services/blog/blog';
import { SocialLinksService } from '../../services/social-links/social-links';
import { SeoService } from '../../services/seo/seo.service';
import { LanguageService } from '../../services/language/lang.service';
import { SocialIcon } from '../template/social-icon-card';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, SocialIcon, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  heading: any;
  socialLinks: any[] = [];
  navItems: any[] = [];
  footerMenuList: any[] = [];
  year = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: BlogApiService,
    private socialLinksService: SocialLinksService,
    private seo: SeoService,
    public langService: LanguageService
  ) {
    this.socialLinks = this.socialLinksService.getSocialLinks();
    this.navItems = [
      { path: '/', label: this.langService.lang.home },
      { path: '#', label: this.langService.lang.about },
      { path: '/blog', label: this.langService.lang.blog },
      { path: '#', label: this.langService.lang.services },
      { path: '#', label: this.langService.lang.contact },
    ];

    this.footerMenuList = [
      {
        heading: this.langService.lang.pages,
        lists: [
          { path: '/', label: this.langService.lang.home },
          { path: '/about', label: this.langService.lang.about },
          { path: '/blog', label: this.langService.lang.blog },
          { path: '/services', label: this.langService.lang.services },
          { path: '/contact', label: this.langService.lang.contact },
        ],
      },
      {
        heading: this.langService.lang.quickLinks,
        lists: [
          {
            path: '/privacy-policy',
            label: this.langService.lang.privacyPolicy,
          },
          {
            path: '/terms-of-service',
            label: this.langService.lang.termsOfService,
          },
          { path: '/disclaimer', label: this.langService.lang.disclimer },
        ],
      },
    ];
  }

  ngOnInit(): void {}
}
