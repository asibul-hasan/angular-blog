import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

// Assuming these imports are correct
import { LanguageSwitcher } from '../template/language-switcher.component';
import { LanguageService } from '../../services/language/lang.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LanguageSwitcher, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  navItems: any = [];
  isOpen = false;
  isDark = false;
  isBrowser = false;

  // State properties
  scrolledToHeader = false;
  scrolledPastHero = false;

  private headerScrollThreshold = 50;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;

    const scrollY = window.scrollY;

    // 1. Opaque state: scrolled past a small amount (50px)
    this.scrolledToHeader = scrollY > this.headerScrollThreshold;

    // 2. Gone state: scrolled past 100vh (the current viewport height)
    // When scrolling UP past 100vh, this becomes FALSE, triggering the reappear.
    this.scrolledPastHero = scrollY > window.innerHeight;
  }

  constructor(
    private router: Router,
    public langService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const theme = localStorage.getItem('theme');
      if (
        theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isDark = true;
        document.documentElement.classList.add('dark');
      }
    }

    this.langService.waitForLanguageLoad().subscribe(() => {
      this.navItems = [
        { path: '/', label: this.langService.lang.home },
        { path: '#', label: this.langService.lang.about },
        { path: '/blog', label: this.langService.lang.blog },
        { path: '#', label: this.langService.lang.services },
        { path: '#', label: this.langService.lang.contact },
      ];
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.onWindowScroll();
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  toggleDarkMode(): void {
    if (!this.isBrowser) return;

    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
