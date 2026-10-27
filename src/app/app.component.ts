import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/template/loader.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
// Import standalone Toast instead of bulk ToastModule to reduce unused code
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, Toast, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = signal('infoAidTech');
}
