import {
  Component,
  HostListener,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../services/language/lang.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Reactive state
  navItems = signal<any[]>([]);
  isOpen = signal(false);
  isDark = signal(false);
  scrolledToHeader = signal(false);
  scrolledPastHero = signal(false);

  // Computed CSS classes
  navbarClasses = computed(() => {
    const scrolled = this.scrolledToHeader();
    const pastHero = this.scrolledPastHero();
    return {
      'translate-y-0': !pastHero,
      '-translate-y-full': pastHero,
      'bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg': scrolled && !pastHero,
      'bg-transparent': !scrolled && !pastHero,
      'border-b border-white/10': scrolled && !pastHero,
    };
  });

  private readonly destroy$ = new Subject<void>();
  private readonly isBrowser: boolean;
  private readonly headerScrollThreshold = 80;
  private readonly heroScrollThreshold: number;

  constructor(
    private router: Router,
    public langService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.heroScrollThreshold = this.isBrowser ? window.innerHeight : 800;

    // Mobile menu effect: prevent body scroll
    effect(() => {
      if (!this.isBrowser) return;

      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on route change
    if (this.isBrowser) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.isOpen.set(false));
    }

    // Initialize nav items after language is loaded
    this.langService
      .waitForLanguageLoad()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.navItems.set([
          { path: '/', label: this.langService.lang.home },
          { path: '/about', label: this.langService.lang.about },
          { path: '/blog', label: this.langService.lang.blog },
          { path: '/service', label: this.langService.lang.services },
          { path: '/contact', label: this.langService.lang.contact },
        ]);
      });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.initializeDarkMode();
    this.updateScrollState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    this.updateScrollState();
  }


  private updateScrollState(): void {
    const scrollY = this.isBrowser ? window.scrollY : 0;
    this.scrolledToHeader.set(scrollY > this.headerScrollThreshold);
    this.scrolledPastHero.set(scrollY > this.heroScrollThreshold);
  }

  private initializeDarkMode(): void {
    if (!this.isBrowser) return;

    try {
      const theme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = theme === 'dark' || (!theme && prefersDark);

      this.isDark.set(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Error initializing dark mode:', error);
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  toggleDarkMode(): void {
    if (!this.isBrowser) return;

    try {
      const newDarkState = !this.isDark();
      this.isDark.set(newDarkState);

      const root = document.documentElement;
      if (newDarkState) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  }

  trackByPath(index: number, item: any): string {
    return item.path;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.closeMenu();
  }
}
