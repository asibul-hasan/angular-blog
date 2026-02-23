import {
  Component, OnInit, OnDestroy, AfterViewChecked,
  ViewChild, ElementRef, ChangeDetectionStrategy,
  inject, PLATFORM_ID, signal, computed
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { ChatbotService, ChatMessage } from '../../services/chatbot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputRef') private inputRef!: ElementRef;

  private readonly chatbotService = inject(ChatbotService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly destroy$ = new Subject<void>();

  // --- Signals ---
  readonly messages = signal<ChatMessage[]>([]);
  readonly isOpen = signal(false);
  readonly isTyping = signal(false);
  readonly userInput = signal('');
  readonly currentPage = signal('');
  readonly unreadCount = signal(0);
  readonly showQuickReplies = signal(true);

  readonly hasInput = computed(() => this.userInput().trim().length > 0);
  readonly canSend = computed(() => this.hasInput() && !this.isTyping());

  private shouldScroll = false;

  // Quick reply suggestions based on context
  readonly quickReplies = computed(() => {
    const page = this.currentPage();
    if (page.includes('image-converter')) {
      return ['How do I convert images?', 'What formats are supported?', 'How does compression work?', 'Is it free to use?'];
    }
    if (page.includes('blog')) {
      return ['Show me latest articles', 'Find programming tutorials', 'Angular tips & tricks', 'Career advice'];
    }
    if (page.includes('jobs') || page.includes('career')) {
      return ['Browse tech jobs', 'Resume tips', 'Interview preparation', 'In-demand skills'];
    }
    return ['What can you help with?', 'Latest tech articles', 'Browse job openings', 'Image converter tool'];
  });

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.chatbotService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(msgs => {
        this.messages.set(msgs);
        this.shouldScroll = true;
      });

    this.chatbotService.getChatState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        const wasOpen = this.isOpen();
        this.isOpen.set(open);
        if (open) { this.shouldScroll = true; this.unreadCount.set(0); }
        if (open && !wasOpen) {
          // Focus input when opening
          setTimeout(() => this.inputRef?.nativeElement?.focus(), 100);
        }
      });

    this.chatbotService.getTypingState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(typing => {
        this.isTyping.set(typing);
        if (typing) this.shouldScroll = true;
      });

    // Track page for context-aware quick replies
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      this.currentPage.set(e.urlAfterRedirects ?? e.url ?? '');
      this.showQuickReplies.set(true);
    });
    this.currentPage.set(this.router.url);

    // Increment unread count when a bot message arrives while chat is closed
    this.chatbotService.getMessages().pipe(takeUntil(this.destroy$)).subscribe(msgs => {
      if (!this.isOpen() && msgs.length > 0) {
        const last = msgs[msgs.length - 1];
        if (last?.role === 'assistant') this.unreadCount.update(n => n + 1);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.chatbotService.toggleChat();
  }

  sendMessage(text?: string): void {
    const msg = (text ?? this.userInput()).trim();
    if (!msg || this.isTyping()) return;
    this.userInput.set('');
    this.showQuickReplies.set(false);
    this.chatbotService.sendMessage(msg).subscribe();
  }

  sendQuickReply(text: string): void {
    this.sendMessage(text);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.chatbotService.clearChat();
    this.showQuickReplies.set(true);
  }

  setInput(value: string): void {
    this.userInput.set(value);
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    if (!this.isBrowser || !this.messagesContainer) return;
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } catch { /* ignore */ }
  }
}
