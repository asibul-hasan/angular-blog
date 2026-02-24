import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Type inference helpers ────────────────────────────────────────────────

const DATE_KEY_PATTERNS = ['_DATE', '_ON', 'ETA_', 'EXPIRE_', 'REQUIRED_DATE', 'SUBMIT_DATE', 'APPROVE_DATE', 'AUDIT_DATE'];
const FLAG_PATTERNS = ['_FLAG', '_STATUS', '_COUNT', 'COUNT_', 'INV_STATUS', 'RCV_STATUS'];

function isDateKey(key: string): boolean {
  return DATE_KEY_PATTERNS.some(p => key.includes(p));
}

function isFlagKey(key: string): boolean {
  return FLAG_PATTERNS.some(p => key.includes(p));
}

function isDateValue(value: any): boolean {
  if (typeof value !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}T/.test(value) || /^\d{2}-[A-Z]{3}-\d{4}/i.test(value);
}

function inferTsType(key: string, value: any): 'Date' | 'string' | 'number' | 'any' {
  if (isDateValue(value) || (value === null && isDateKey(key))) return 'Date';
  if (value === null) {
    if (key.endsWith('_NO') || key.endsWith('_CNT') || isFlagKey(key)) return 'number';
    if (key.endsWith('_D') || key.endsWith('_NAME') || key.endsWith('_ID')) return 'string';
    return 'any';
  }
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'number';
  return 'any';
}

function getDefault(key: string, value: any, tsType: string): string {
  if (tsType === 'Date') return 'null';
  if (value !== null && typeof value === 'number') {
    if (isFlagKey(key)) return String(value);
    return 'null';
  }
  if (isFlagKey(key)) return '0';
  return 'null';
}

interface FieldDef {
  key: string;
  tsType: 'Date' | 'string' | 'number' | 'any';
  defaultVal: string;
  isDate: boolean;
}

function generateClass(json: Record<string, any>, className: string, baseClass: string): string {
  const fields: FieldDef[] = Object.entries(json).map(([key, value]) => {
    const tsType = inferTsType(key, value);
    return { key, tsType, defaultVal: getDefault(key, value, tsType), isDate: tsType === 'Date' };
  });

  const extendsClause = baseClass.trim() ? ` extends ${baseClass.trim()}` : '';
  const declarations = fields.map(f => `    ${f.key}: ${f.tsType};`).join('\n');
  const assignments = fields.map(f => {
    if (f.isDate) return `        this.${f.key} = options.${f.key} ? new Date(options.${f.key}) : null;`;
    return `        this.${f.key} = options.${f.key} ?? ${f.defaultVal};`;
  }).join('\n');
  const superCall = baseClass.trim() ? '\n        super(options);' : '';

  return `export class ${className}${extendsClause} {\n\n${declarations}\n\n    constructor(options: any = {}) {${superCall}\n${assignments}\n    }\n}`;
}

// ─── Syntax highlighter ───────────────────────────────────────────────────

function syntaxHighlight(code: string): string {
  if (!code) return '';
  let out = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  out = out
    .replace(/'([^']*)'/g, `<span class="sh-str">'$1'</span>`)
    .replace(/\b(export|class|extends|constructor|new|return|if|else|const|let|var)\b/g, `<span class="sh-kw">$1</span>`)
    .replace(/\b(Date|string|number|boolean|any|void|never)\b/g, `<span class="sh-type">$1</span>`)
    .replace(/(?<=class )\w+/g, `<span class="sh-cls">$&</span>`)
    .replace(/\bthis\b/g, `<span class="sh-this">this</span>`)
    .replace(/\boptions\.(\w+)/g, `<span class="sh-opt">options</span>.<span class="sh-prop">$1</span>`)
    .replace(/^(    )([A-Z_0-9]+)(?=:)/gm, `$1<span class="sh-prop">$2</span>`)
    .replace(/\b(\d+)\b/g, `<span class="sh-num">$1</span>`)
    .replace(/\bnull\b/g, `<span class="sh-null">null</span>`);
  return out;
}

// ─── Component ────────────────────────────────────────────────────────────

@Component({
  selector: 'app-json-to-ts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .sh-kw   { color: #c084fc; }
    .sh-type { color: #67e8f9; }
    .sh-str  { color: #86efac; }
    .sh-num  { color: #fb923c; }
    .sh-cls  { color: #fcd34d; }
    .sh-prop { color: #93c5fd; }
    .sh-this { color: #f9a8d4; }
    .sh-opt  { color: #94a3b8; }
    .sh-null { color: #4b5563; }
    
    /* Custom thin scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `],
  template: `
    <div class="pt-28 pb-10 px-4 md:px-8 flex justify-center w-full bg-transparent">
      <div class="w-full max-w-[90rem] flex flex-col bg-gray-950 text-gray-200 font-mono rounded-2xl border border-gray-800 shadow-2xl overflow-hidden min-h-[700px] max-h-[85vh]">

        <!-- Header -->
        <header class="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5 bg-gray-950 border-b border-gray-800 shrink-0">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl sm:text-2xl font-black text-gray-950 tracking-tighter shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            {{ '{' }} {{ '}' }}
          </div>
          <div class="flex-1">
            <h2 class="text-2xl md:text-3xl font-bold tracking-wide text-amber-400 font-sans mt-0 mb-1 leading-none">JSON → TypeScript Class Converter</h2>
            <p class="text-[14px] text-gray-500 font-sans">Paste an API response, configure class names, and generate strongly typed model classes instantly.</p>
          </div>
          <span class="hidden md:inline-block text-[10px] tracking-widest text-gray-500 border border-gray-800 px-3 py-1.5 rounded-md bg-gray-900/50 uppercase font-sans font-bold">DEV TOOL</span>
        </header>

        <!-- Config bar -->
        <div class="flex items-center gap-4 px-6 py-3 bg-gray-900 border-b border-gray-800 shrink-0 flex-wrap">
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-500 whitespace-nowrap font-medium">Class name</label>
            <input
              [(ngModel)]="className"
              placeholder="MyModel"
              class="bg-gray-950 border border-gray-700 rounded-md text-amber-400 text-sm px-3 py-1.5 w-48 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono shadow-inner"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-500 whitespace-nowrap font-medium">Extends</label>
            <input
              [(ngModel)]="baseClass"
              placeholder="BaseModel (optional)"
              class="bg-gray-950 border border-gray-700 rounded-md text-amber-400 text-sm px-3 py-1.5 w-56 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono shadow-inner"
            />
          </div>
          <div class="flex-1"></div>
          <button
            (click)="clear()"
            class="text-xs font-bold tracking-wider text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-md transition-colors"
          >
            ✕ CLEAR
          </button>
          <button
            (click)="generate()"
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-[13px] px-6 py-2 rounded-md tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
            </svg>
            GENERATE
          </button>
        </div>

        <!-- Error -->
        <div *ngIf="error()" class="flex items-center gap-3 px-6 py-2.5 bg-red-950/80 border-b border-red-900/50 text-red-400 text-[13px] shrink-0 font-medium">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ error() }}
        </div>

        <!-- Main panels -->
        <div class="flex flex-col md:flex-row flex-1 min-h-0 bg-gray-900/20">

          <!-- INPUT panel -->
          <div class="flex flex-col flex-1 min-w-0 md:border-r border-gray-800">
            <div class="flex items-center gap-3 px-5 py-2.5 bg-gray-900/80 border-b border-gray-800/80 shrink-0">
              <span class="text-[11px] font-bold tracking-[0.2em] text-gray-500">INPUT</span>
              <span class="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">JSON</span>
              <button (click)="beautify()" class="text-[11px] font-medium text-amber-600 hover:text-amber-400 bg-gray-950 border border-gray-800 hover:border-amber-900/50 px-3 py-1.5 rounded transition-all ml-2 shadow-sm flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                Beautify
              </button>
              <span class="ml-auto text-[11px] text-gray-600 font-sans tracking-wide">{{ inputLineCount() }} {{ inputLineCount() === 1 ? 'line' : 'lines' }}</span>
            </div>
            <div class="flex flex-1 min-h-0 overflow-auto bg-[#0a0f18]/50">
              <div class="select-none text-right text-xs leading-[24px] text-gray-700 border-r border-gray-800/50 px-3 py-4 min-w-[50px] shrink-0">
                <div *ngFor="let n of inputLines()">{{ n }}</div>
              </div>
              <textarea
                [(ngModel)]="inputJson"
                (keydown.Tab)="onTab($event)"
                spellcheck="false"
                placeholder="Paste your JSON object here..."
                class="flex-1 bg-transparent border-none outline-none resize-none text-emerald-400 text-[13px] leading-[24px] p-4 placeholder-gray-800 w-full font-mono"
              ></textarea>
            </div>
          </div>

          <!-- Divider arrow for desktop (hidden on mobile) -->
          <div class="hidden md:flex items-center justify-center w-12 bg-gray-900/50 shrink-0 z-10 border-x border-gray-800/30 shadow-inner">
            <button
              (click)="generate()"
              title="Generate"
              class="w-8 h-8 flex items-center justify-center text-amber-600 hover:text-amber-400 hover:bg-gray-800 rounded-full transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <!-- OUTPUT panel -->
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex items-center gap-3 px-5 py-2.5 bg-gray-900/80 border-t md:border-t-0 border-b border-gray-800/80 shrink-0">
              <span class="text-[11px] font-bold tracking-[0.2em] text-gray-500">OUTPUT</span>
              <span class="text-[10px] font-bold text-sky-500 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-sm">TYPESCRIPT</span>
              <span *ngIf="output()" class="text-[11px] text-gray-600 ml-2 hidden sm:inline-block font-sans tracking-wide">{{ outputLineCount() }} {{ outputLineCount() === 1 ? 'line' : 'lines' }}</span>
              
              <div class="ml-auto flex items-center">
                <button
                  *ngIf="output()"
                  (click)="copyOutput()"
                  class="flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-md transition-all shadow-sm"
                  [class.text-emerald-400]="copied()"
                  [class.border-emerald-800]="copied()"
                  [class.bg-emerald-900/30]="copied()"
                  [class.text-gray-400]="!copied()"
                  [class.border-gray-700]="!copied()"
                  [class.bg-gray-950]="!copied()"
                  [class.hover:text-gray-200]="!copied()"
                  [class.hover:border-gray-600]="!copied()"
                >
                  <svg *ngIf="copied()" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  <svg *ngIf="!copied()" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  {{ copied() ? 'Copied to Clipboard!' : 'Copy Code' }}
                </button>
              </div>
            </div>

            <div class="flex flex-1 min-h-0 overflow-auto bg-[#0a0f18]/50">
              <ng-container *ngIf="output(); else emptyState">
                <div class="select-none text-right text-xs leading-[24px] text-gray-700 border-r border-gray-800/50 px-3 py-4 min-w-[50px] shrink-0">
                  <div *ngFor="let n of outputLines()">{{ n }}</div>
                </div>
                <pre
                  class="flex-1 text-[13px] leading-[24px] p-4 overflow-auto text-gray-200 m-0 whitespace-pre bg-transparent font-mono"
                  [innerHTML]="highlightedOutput()"
                ></pre>
              </ng-container>

              <ng-template #emptyState>
                <div class="flex-1 flex flex-col items-center justify-center gap-4 text-gray-700 p-8 text-center bg-[#0a0f18]/10">
                  <div class="w-20 h-20 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-center shadow-inner">
                    <span class="text-4xl font-light tracking-tighter text-gray-600">{{ '{' }} {{ '}' }}</span>
                  </div>
                  <div>
                    <h3 class="text-base font-semibold text-gray-400">No output generated yet</h3>
                    <p class="text-[13px] mt-1 text-gray-500 max-w-sm">Configure your settings and click <span class="text-amber-600 font-bold px-1">GENERATE</span> to produce your TypeScript class.</p>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <footer class="flex items-center justify-center sm:justify-start flex-wrap gap-x-6 gap-y-2 px-6 py-3 border-t border-gray-800 bg-gray-900 shrink-0 text-xs text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)] shrink-0"></span>Date <span class="text-gray-700 hidden sm:inline font-sans">( _DATE, _ON, ETA_, ISO )</span>
          </span>
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)] shrink-0"></span>Number <span class="text-gray-700 hidden sm:inline font-sans">( _NO, _CNT, _FLAG, _STATUS )</span>
          </span>
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0"></span>String <span class="text-gray-700 hidden sm:inline font-sans">( _D, _NAME, _ID )</span>
          </span>
          <div class="ml-auto hidden md:flex items-center gap-3 text-[11px] font-mono">
            <span class="flex items-center gap-1.5"><code class="text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">FLAG/STATUS</code> → <span class="text-gray-400">0</span></span>
            <span class="text-gray-700">|</span>
            <span class="flex items-center gap-1.5"><code class="text-gray-400 bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded">others</code> → <span class="text-sky-400/70">null</span></span>
          </div>
        </footer>

      </div>
    </div>
  `
})
export class JsonToTsComponent {

  inputJson = "{}";
  className = 'EnterYourClassName';
  baseClass = 'BaseEntity';

  output = signal('');
  error  = signal('');
  copied = signal(false);

  inputLineCount    = computed(() => Math.max(this.inputJson.split('\n').length, 1));
  outputLineCount   = computed(() => this.output() ? this.output().split('\n').length : 0);
  inputLines        = computed(() => Array.from({ length: Math.max(this.inputLineCount(), 24) }, (_, i) => i + 1));
  outputLines       = computed(() => Array.from({ length: Math.max(this.outputLineCount(), 24) }, (_, i) => i + 1));
  highlightedOutput = computed(() => syntaxHighlight(this.output()));

  beautify(): void {
    if (!this.inputJson.trim()) return;
    try {
      // Use loose evaluation to fix missing quotes around keys, trailing commas, etc.
      const looseParse = new Function('return ' + this.inputJson.trim() + ';');
      const parsed = looseParse();
      this.inputJson = JSON.stringify(parsed, null, 4);
      this.error.set('');
    } catch (e: any) {
      this.error.set('Beautify failed: Could not parse input. Check for major syntax errors.');
    }
  }

  generate(): void {
    this.error.set('');
    if (!this.inputJson.trim()) {
      this.error.set('Input is empty — paste a JSON object to continue.');
      return;
    }
    try {
      // Support loose/JS-object format too
      const looseParse = new Function('return ' + this.inputJson.trim() + ';');
      const json = looseParse();
      
      if (typeof json !== 'object' || Array.isArray(json) || json === null) {
        this.error.set('Input must be a plain object { ... }, not an array or primitive.');
        return;
      }
      this.output.set(generateClass(json, this.className.trim() || 'GeneratedModel', this.baseClass));
    } catch (e: any) {
      this.error.set('JSON parse error: ' + e.message);
    }
  }

  clear(): void {
    this.inputJson = "{}";
    this.output.set('');
    this.error.set('');
  }

  copyOutput(): void {
    navigator.clipboard.writeText(this.output()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  onTab(event: any): void {
    event.preventDefault();
    const el = event.target as HTMLTextAreaElement;
    const start = el.selectionStart;
    this.inputJson =
      this.inputJson.substring(0, start) + '    ' + this.inputJson.substring(el.selectionEnd);
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + 4; }, 0);
  }
}