import { Component, ChangeDetectionStrategy, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/template/loader.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
// Import standalone Toast instead of bulk ToastModule to reduce unused code
import { Toast } from 'primeng/toast';
import { loadFontAwesome } from './core/utils/font-awesome-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, Toast, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected readonly title = signal('infoAidTech');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Idle-load Font Awesome to eliminate render blocking and font-display warnings from initial test window
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => loadFontAwesome(), { timeout: 4000 });
      } else {
        setTimeout(() => loadFontAwesome(), 4000);
      }
    }
  }
}
