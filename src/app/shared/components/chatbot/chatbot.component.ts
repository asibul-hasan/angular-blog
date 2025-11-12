import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot/chatbot.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    messages: ChatMessage[] = [];
    userInput = '';
    isOpen = false;
    isTyping = false;
    isBrowser = false;
    private destroy$ = new Subject<void>();
    private shouldScroll = false;

    constructor(
        private chatbotService: ChatbotService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        if (!this.isBrowser) return;

        this.chatbotService
            .getMessages()
            .pipe(takeUntil(this.destroy$))
            .subscribe((messages) => {
                this.messages = messages;
                this.shouldScroll = true;
            });

        this.chatbotService
            .getChatState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((isOpen) => {
                this.isOpen = isOpen;
                if (isOpen) {
                    this.shouldScroll = true;
                }
            });

        this.chatbotService
            .getTypingState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((isTyping) => {
                this.isTyping = isTyping;
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

    sendMessage(): void {
        if (!this.userInput.trim() || this.isTyping) return;

        const message = this.userInput.trim();
        this.userInput = '';

        this.chatbotService.sendMessage(message).subscribe();
    }

    handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    clearChat(): void {
        this.chatbotService.clearChat();
    }

    private scrollToBottom(): void {
        if (!this.isBrowser || !this.messagesContainer) return;

        try {
            const element = this.messagesContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
        } catch (err) {
            console.error('Scroll error:', err);
        }
    }

    getMessageTime(timestamp: Date): string {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}
