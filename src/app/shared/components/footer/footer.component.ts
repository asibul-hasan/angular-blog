import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogApiService } from '../../services/blog/blog.service';
import { SocialLinksService } from '../../services/social-links/social-links.service';
import { SeoService } from '../../services/seo/seo.service';
import { LanguageService } from '../../services/language/lang.service';
import { SocialIcon } from '../template/social-icon-card.component';
import path from 'path';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, SocialIcon, RouterModule],
  standalone: true,

  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
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
    // this.navItems = [
    //   { path: '/', label: this.langService.lang.home },
    //   { path: '#', label: this.langService.lang.about },
    //   { path: '/blog', label: this.langService.lang.blog },
    //   { path: '#', label: this.langService.lang.services },
    //   { path: '#', label: this.langService.lang.contact },
    // ];

    this.footerMenuList = [
      {
        heading: 'Pages',
        lists: [
          { path: '/', label: 'Home' },
          { path: '/about', label: 'About Us' },
          { path: '/blog', label: 'Blog' },
          { path: '/service', label: 'Services' },
          { path: '/contact', label: 'Contact' },
          { path: '/careers', label: 'Career' },
          { path: '/internship/apply', label: 'Internship' },
        ],
      },
      {
        heading: 'Quick Links',
        lists: [
          {
            path: '/privacy-policy',
            label: 'Privacy Policy',
          },
          {
            path: '/terms-of-service',
            label: 'Terms of Service',
          },
          { path: '/disclaimer', label: 'Disclaimer' },
        ],
      },
      {
        heading: 'Products',
        lists: [
          {
            path: '/aidly-erp',
            label: 'Aidly ERP (Pharma & Retail)',
          },
          {
            path: '/conventional-commit-generator',
            label: 'Conventional Commit Generator',
          },
          {
            path: '/image-converter',
            label: 'Image Converter',
          },
          {
            path: '/json-to-ts',
            label: 'JSON to TS',
          },
          {
            path: '/ghost-rewrite',
            label: 'Ghost Rewrite',
          },
        ],
      },
    ];
  }

  ngOnInit(): void {}
}
