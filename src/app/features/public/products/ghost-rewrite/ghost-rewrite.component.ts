import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ghost-rewrite',
  imports: [CommonModule],
  templateUrl: './ghost-rewrite.component.html',
  styleUrls: ['./ghost-rewrite.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostRewriteComponent {
  public inputText = signal<string>('');
  public outputText = signal<string>('');
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  // New State for AI Checker
  public isCheckingAI = signal<boolean>(false);
  public aiPercentage = signal<number | null>(null);
  public humanPercentage = signal<number | null>(null);
  public highlights = signal<{text: string, classification: 'human' | 'ai'}[]>([]);

  // Computed state for UI elements
  public strokeDasharray = computed(() => {
    const ai = this.aiPercentage() || 0;
    // Length of the circle border is roughly 2 * pi * radius (assuming r=40 -> ~251)
    const circumference = 251.2;
    const aiDash = (ai / 100) * circumference;
    const humanDash = circumference - aiDash;
    return `${humanDash} ${aiDash}`;
  });

  @ViewChild('outputContainer') private outputContainer!: ElementRef;

  public wordCount = computed(() => {
    const text = this.inputText().trim();
    return text ? text.split(/\s+/).length : 0;
  });

  public onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.inputText.set(target.value);
  }

  public async humanizeLargeText(): Promise<void> {
    if (!this.inputText().trim() || this.wordCount() > 15000) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.outputText.set('');
    this.aiPercentage.set(null);
    this.humanPercentage.set(null);
    this.highlights.set([]);

    try {
      const apiUrl = `${environment.apiUrl}/ghost-rewrite`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: this.inputText() })
      });

      if (!response.ok) {
        throw new Error('Failed to reach backend for rewriting.');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported by the browser.');
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          // values can come as multiple chunks together separated by \n\n
          const events = value.split('\n\n');
          for (const ev of events) {
             if (ev.startsWith('data: ')) {
               const dataStr = ev.replace('data: ', '');
               if (dataStr === '[DONE]') {
                 continue;
               }
               try {
                 const data = JSON.parse(dataStr);
                 if (data.text) {
                   this.outputText.update(current => current + data.text);
                   this.scrollToBottom();
                 }
               } catch (e) {
                 // Might be incomplete JSON chunk, though normally event-stream sends complete serialized chunks
                 console.warn("Could not parse chunk", e);
               }
             }
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      this.errorMessage.set(error.message || 'An unexpected error occurred during processing.');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async checkAIGeneration(): Promise<void> {
    if (!this.inputText().trim() || this.wordCount() > 15000) return;

    this.isCheckingAI.set(true);
    this.errorMessage.set(null);
    this.outputText.set('');
    
    try {
      const apiUrl = `${environment.apiUrl}/ghost-rewrite/check`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: this.inputText() })
      });

      if (!response.ok) {
        throw new Error('Failed to reach backend for AI check.');
      }

      const data = await response.json();
      this.aiPercentage.set(data.aiPercentage);
      this.humanPercentage.set(data.humanPercentage);
      this.highlights.set(data.highlights || []);

    } catch (error: any) {
      console.error(error);
      this.errorMessage.set(error.message || 'An unexpected error occurred during processing.');
    } finally {
      this.isCheckingAI.set(false);
    }
  }

  public copyToClipboard(): void {
    navigator.clipboard.writeText(this.outputText());
  }

  private scrollToBottom(): void {
    if (this.outputContainer) {
      setTimeout(() => {
        this.outputContainer.nativeElement.scrollTop = this.outputContainer.nativeElement.scrollHeight;
      }, 0);
    }
  }
}
