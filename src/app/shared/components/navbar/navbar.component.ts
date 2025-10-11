import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  scrolledToHeader = false;
  scrolledPastHero = false;

  private headerScrollThreshold = 50;

  constructor(
    private router: Router,
    public langService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

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
      // ✅ Browser-only initialization
      const theme = localStorage.getItem('theme');
      if (
        theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isDark = true;
        document.documentElement.classList.add('dark');
      }

      this.onWindowScroll(); // Initialize scroll state
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    const scrollY = window.scrollY;
    this.scrolledToHeader = scrollY > this.headerScrollThreshold;
    this.scrolledPastHero = scrollY > window.innerHeight;
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

    const root = document.documentElement;

    if (this.isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
