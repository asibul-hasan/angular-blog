import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageSwitcher } from '../template/language-switcher';
import { LanguageService } from '../../services/language/lang.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LanguageSwitcher, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  navItems: any = [];
  isOpen = false;
  // isOpen = false;
  isDark = false;
  isBrowser = false;

  constructor(
    private router: Router,
    public langService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Safe to access window/localStorage
      const theme = localStorage.getItem('theme');
      if (
        theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isDark = true;
        document.documentElement.classList.add('dark');
      }
    }
    this.navItems = [
      { path: '/', label: this.langService.lang.home },
      { path: '#', label: this.langService.lang.about },
      { path: '/blog', label: this.langService.lang.blog },
      { path: '#', label: this.langService.lang.services },
      { path: '#', label: this.langService.lang.contact },
    ];
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
