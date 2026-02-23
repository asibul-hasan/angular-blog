import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatbotConfig {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
    private readonly http = inject(HttpClient);

    private messages$ = new BehaviorSubject<ChatMessage[]>([]);
    private isOpen$ = new BehaviorSubject<boolean>(false);
    private isTyping$ = new BehaviorSubject<boolean>(false);

    private config: ChatbotConfig = {
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: `You are Haptic, InfoAidTech's specialized AI assistant. You ONLY help with InfoAidTech's services and technology topics.

YOUR IDENTITY:
- You work exclusively for InfoAidTech, a technology blog and career platform
- You are an expert in tech education, programming, and career guidance
- You are friendly but professionally focused on InfoAidTech's mission

WHAT YOU CAN DISCUSS:
✅ InfoAidTech blog posts (programming tutorials, tech articles)
✅ Job opportunities and career advice in tech
✅ Technology topics: Web Dev, Mobile Dev, DevOps, AI/ML, Cybersecurity
✅ Programming languages and frameworks
✅ InfoAidTech's website features and navigation
✅ InfoAidTech tools like the Image Converter (supports JPEG, PNG, WebP, AVIF, BMP, ICO, TIFF, GIF)
✅ Social media content (LinkedIn, Twitter, Facebook, GitHub)

WHAT YOU CANNOT DISCUSS:
❌ Weather, sports, entertainment, celebrities
❌ General world news unrelated to tech
❌ Other companies' products (unless comparing to learning resources)
❌ Personal advice outside of tech careers
❌ Topics completely unrelated to technology

YOUR RESPONSE STYLE:
- Keep it short and focused (2-4 sentences usually)
- Always relate back to InfoAidTech's services
- Suggest specific actions: "Check our blog for...", "Browse our jobs for...", "Read about..."
- Use emojis sparingly 😊 (1-2 max per response)
- If asked off-topic questions, politely redirect to tech topics

REDIRECTION EXAMPLES:
User: "What's the weather?"
You: "I'm focused on tech topics! 😊 Instead, how about exploring our latest programming tutorials or job openings in software development?"

User: "Tell me a joke"
You: "Haha, I'm better at helping with code than comedy! 🚀 Want to learn about a new programming language or find a tech job instead?"

Remember: Every conversation should guide users to InfoAidTech's content or services!`,
    };

    constructor() {
        this.initializeChat();
    }

    private initializeChat(): void {
        const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: `👋 Hi! I'm Haptic, your InfoAidTech guide!\n\nI help with:\n🔧 Tech Tutorials — Programming, web dev, mobile apps\n💼 Career Opportunities — Browse tech jobs\n📚 Learning Resources — Guides and best practices\n🔍 Site Navigation — Find what you need\n🖼️ Image Converter — Convert between 8 formats\n\nWhat tech topic interests you today?`,
            timestamp: new Date(),
        };
        this.messages$.next([welcomeMessage]);
    }

    getMessages(): Observable<ChatMessage[]> {
        return this.messages$.asObservable();
    }

    getChatState(): Observable<boolean> {
        return this.isOpen$.asObservable();
    }

    getTypingState(): Observable<boolean> {
        return this.isTyping$.asObservable();
    }

    toggleChat(): void {
        this.isOpen$.next(!this.isOpen$.value);
    }

    openChat(): void {
        this.isOpen$.next(true);
    }

    closeChat(): void {
        this.isOpen$.next(false);
    }

    sendMessage(userMessage: string): Observable<ChatMessage> {
        const userMsg: ChatMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
        };

        this.messages$.next([...this.messages$.value, userMsg]);
        this.isTyping$.next(true);

        return this.sendToChatbot(userMessage).pipe(
            map((response) => {
                const assistantMsg: ChatMessage = {
                    role: 'assistant',
                    content: response,
                    timestamp: new Date(),
                };
                this.messages$.next([...this.messages$.value, assistantMsg]);
                this.isTyping$.next(false);
                return assistantMsg;
            }),
            catchError((error) => {
                console.error('Chatbot error:', error);
                const errorMsg: ChatMessage = {
                    role: 'assistant',
                    content: error?.name === 'TimeoutError'
                        ? "That's taking longer than expected. Could you try asking again?"
                        : "Sorry, I'm having trouble connecting! 😅 Please try again in a moment.",
                    timestamp: new Date(),
                };
                this.messages$.next([...this.messages$.value, errorMsg]);
                this.isTyping$.next(false);
                return of(errorMsg);
            })
        );
    }

    private sendToChatbot(message: string): Observable<string> {
        const recentHistory = this.messages$.value
            .slice(-6)
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        return this.http
            .post<{ success: boolean; response: string; fallback?: boolean }>(
                `${environment.apiUrl}/chatbot/gemini/chat`,
                {
                    message,
                    conversationHistory: recentHistory,
                    systemPrompt: this.config.systemPrompt,
                }
            )
            .pipe(
                map((response) => {
                    if ((response?.success || response?.fallback) && response?.response) {
                        return response.response;
                    }
                    throw new Error('Invalid response format');
                }),
                catchError((error) => {
                    throw new Error(
                        `Chat error: ${error.error?.message || error.message || 'Connection failed'}`
                    );
                })
            );
    }

    clearChat(): void {
        this.initializeChat();
    }

    getConversationHistory(): string {
        return this.messages$.value
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
    }
}