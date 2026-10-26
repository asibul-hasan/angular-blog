import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { SeoService } from '../../../../shared/services/seo/seo.service';

export interface CommitTypeMeta {
  id: string;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const COMMIT_TYPES_MAP: Record<string, CommitTypeMeta> = {
  feat: { id: 'feat', label: 'Feature', color: '#10b981', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30' },
  fix: { id: 'fix', label: 'Bug Fix', color: '#ef4444', bgClass: 'bg-rose-500/10', textClass: 'text-rose-400', borderClass: 'border-rose-500/30' },
  docs: { id: 'docs', label: 'Documentation', color: '#38bdf8', bgClass: 'bg-sky-500/10', textClass: 'text-sky-400', borderClass: 'border-sky-500/30' },
  refactor: { id: 'refactor', label: 'Refactor', color: '#a855f7', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', borderClass: 'border-purple-500/30' },
  perf: { id: 'perf', label: 'Performance', color: '#eab308', bgClass: 'bg-yellow-500/10', textClass: 'text-yellow-400', borderClass: 'border-yellow-500/30' },
  test: { id: 'test', label: 'Testing', color: '#06b6d4', bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-400', borderClass: 'border-cyan-500/30' },
  style: { id: 'style', label: 'Style & Lint', color: '#ec4899', bgClass: 'bg-pink-500/10', textClass: 'text-pink-400', borderClass: 'border-pink-500/30' },
  build: { id: 'build', label: 'Build & Deps', color: '#f97316', bgClass: 'bg-orange-500/10', textClass: 'text-orange-400', borderClass: 'border-orange-500/30' },
  ci: { id: 'ci', label: 'CI / CD', color: '#6366f1', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400', borderClass: 'border-indigo-500/30' },
  chore: { id: 'chore', label: 'Maintenance', color: '#94a3b8', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400', borderClass: 'border-slate-500/30' },
  revert: { id: 'revert', label: 'Revert', color: '#f43f5e', bgClass: 'bg-rose-500/10', textClass: 'text-rose-400', borderClass: 'border-rose-500/30' },
};

const IMPERATIVE_VERBS: Record<string, string> = {
  fixed: 'fix',
  fixes: 'fix',
  fixing: 'fix',
  added: 'add',
  adds: 'add',
  adding: 'add',
  updated: 'update',
  updates: 'update',
  updating: 'update',
  removed: 'remove',
  removes: 'remove',
  removing: 'remove',
  deleted: 'delete',
  deletes: 'delete',
  deleting: 'delete',
  implemented: 'implement',
  implements: 'implement',
  implementing: 'implement',
  refactored: 'refactor',
  refactors: 'refactor',
  refactoring: 'refactor',
  cleaned: 'clean',
  cleans: 'clean',
  cleaning: 'clean',
  migrated: 'migrate',
  migrates: 'migrate',
  migrating: 'migrate',
  bumped: 'bump',
  bumps: 'bump',
  bumping: 'bump',
  upgraded: 'upgrade',
  upgrades: 'upgrade',
  upgrading: 'upgrade',
  resolved: 'resolve',
  resolves: 'resolve',
  resolving: 'resolve',
  created: 'create',
  creates: 'create',
  creating: 'create',
  tested: 'test',
  tests: 'test',
  testing: 'test',
  wrote: 'add',
  write: 'add',
  writing: 'add',
  improved: 'improve',
  improves: 'improve',
  improving: 'improve',
  changed: 'change',
  changes: 'change',
  changing: 'change',
  handled: 'handle',
  handles: 'handle',
  handling: 'handle',
  prevented: 'prevent',
  prevents: 'prevent',
  preventing: 'prevent',
  enabled: 'enable',
  enables: 'enable',
  enabling: 'enable',
  disabled: 'disable',
  disables: 'disable',
  disabling: 'disable',
  configured: 'configure',
  configures: 'configure',
  configuring: 'configure',
  supported: 'support',
  supports: 'support',
  supporting: 'support',
};

const KEYWORD_GROUPS = [
  { type: 'fix', keywords: ['fix', 'fixes', 'fixed', 'fixing', 'bug', 'bugs', 'error', 'errors', 'crash', 'crashed', 'broken', 'issue', 'issues', 'resolve', 'resolved', 'patch', 'patched'] },
  { type: 'feat', keywords: ['add', 'added', 'adding', 'feature', 'features', 'new', 'implement', 'implemented', 'implementing', 'support', 'supported', 'create', 'created', 'introduce', 'introduced'] },
  { type: 'docs', keywords: ['doc', 'docs', 'documentation', 'readme', 'comment', 'comments', 'guide', 'tutorial', 'changelog', 'license'] },
  { type: 'refactor', keywords: ['refactor', 'refactored', 'refactoring', 'clean', 'cleaned', 'cleanup', 'restructure', 'restructured', 'reorganize', 'reorganized', 'rewrite', 'simplify', 'move', 'moved'] },
  { type: 'style', keywords: ['format', 'formatted', 'formatting', 'lint', 'linted', 'spacing', 'indent', 'style', 'styles', 'css', 'prettier', 'whitespace'] },
  { type: 'test', keywords: ['test', 'tests', 'tested', 'testing', 'spec', 'specs', 'coverage', 'unit', 'e2e', 'integration', 'mock', 'jest', 'jasmine'] },
  { type: 'build', keywords: ['build', 'dependency', 'dependencies', 'deps', 'package', 'packages', 'webpack', 'vite', 'rollup', 'npm', 'yarn', 'pnpm', 'bump', 'bumped', 'upgrade', 'upgraded'] },
  { type: 'ci', keywords: ['ci', 'pipeline', 'pipelines', 'workflow', 'workflows', 'github actions', 'gitlab', 'circleci', 'travis', 'dockerfile'] },
  { type: 'perf', keywords: ['perf', 'performance', 'optimize', 'optimized', 'optimization', 'speed', 'speedup', 'faster', 'memory', 'cache', 'caching'] },
  { type: 'revert', keywords: ['revert', 'reverted', 'reverting', 'undo', 'rollback'] },
  { type: 'chore', keywords: ['chore', 'maintenance', 'update', 'updated', 'misc', 'miscellaneous', 'task', 'release'] }
];

function wordWrap(text: string, maxChars = 72): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxChars) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

@Component({
  selector: 'app-conventional-commit-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conventional-commit-generator.component.html',
  styleUrls: ['./conventional-commit-generator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConventionalCommitGeneratorComponent implements OnInit {
  private readonly seo = inject(SeoService);

  // Main Input
  public rawInput = signal<string>('fixed the login button not working on mobile devices, refs #42');

  // Overrides if user explicitly types in output boxes
  public userCustomTitle = signal<string | null>(null);
  public userCustomDescription = signal<string | null>(null);

  // UI state
  public isAiLoading = signal<boolean>(false);
  public activeEngine = signal<'rules' | 'gemini'>('rules');
  public aiErrorMessage = signal<string | null>(null);

  // 4 Copy states
  public copiedTitle = signal<boolean>(false);
  public copiedDescription = signal<boolean>(false);
  public copiedFull = signal<boolean>(false);
  public copiedGitCommand = signal<boolean>(false);

  // Reference Table Data for SEO Section
  public commitTypesList = Object.values(COMMIT_TYPES_MAP);

  // FAQ Items for SEO
  public faqList = [
    {
      question: 'What is the Conventional Commits specification?',
      answer:
        'The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools like automated changelogs and semantic release tagging.',
    },
    {
      question: 'How does automatic type detection work in this generator?',
      answer:
        'The generator evaluates your casual description using linguistic pattern recognition. Keywords like "fix", "crash", or "issue" map to fix; "add" or "support" map to feat; while "dependencies" or "bump" map to build. If ambiguity arises, it defaults cleanly to chore or lets Gemini AI synthesize the intent.',
    },
    {
      question: 'What are the rules for an imperative mood commit subject?',
      answer:
        'Conventional commit subjects should always be written in the imperative mood (e.g., "add feature", "fix issue", "update API") rather than past or continuous tense ("added", "fixing", "updates"). The subject should start with a lowercase letter, omit trailing periods, and remain within 50 to 72 characters.',
    },
    {
      question: 'How are breaking changes represented?',
      answer:
        'A breaking change is marked either by adding an exclamation mark (!) immediately after the type or scope (e.g., feat(api)!: remove v1 endpoints) or by adding a BREAKING CHANGE: footer in the commit description body.',
    },
    {
      question: 'Are my commit messages or private code stored on your servers?',
      answer:
        'No. The default analysis engine executes 100% locally in your web browser with zero network latency. If you choose to polish with Gemini AI, only the specific description string is evaluated and never persisted.',
    },
  ];

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Conventional Commit Generator — Free Online Git Message Formatter',
      description:
        'Generate structured, standard Conventional Commits v1.0.0 from casual change notes instantly. Features automatic type detection, scope extraction, imperative subject formatting, and 4 one-click copy options.',
      keywords:
        'conventional commit generator, git commit message generator, conventional commits v1.0.0, semantic commit messages, git commit format, git commit -m generator, dev tools infoaidtech',
      type: 'website',
    });

    this.seo.addBreadcrumbs([
      { name: 'Home', url: environment.SITE_URL },
      { name: 'Products', url: `${environment.SITE_URL}/products` },
      {
        name: 'Conventional Commit Generator',
        url: `${environment.SITE_URL}/conventional-commit-generator`,
      },
    ]);
  }

  // Auto-analysis pipeline
  public autoAnalysis = computed(() => {
    const text = this.rawInput().trim();
    if (!text) {
      return {
        type: 'chore',
        scope: '',
        breaking: false,
        subject: '',
        title: '',
        description: '',
        fullCommit: '',
        gitCommand: 'git commit -m ""',
      };
    }

    const lower = text.toLowerCase();

    // 1. Auto-Detect Type
    let bestScore = 0;
    let matchedType = 'chore';
    for (const group of KEYWORD_GROUPS) {
      let score = 0;
      for (const kw of group.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(lower)) {
          score += (group.type === 'fix' || group.type === 'feat') ? 2 : 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        matchedType = group.type;
      }
    }
    const detectedType = matchedType;

    // 2. Auto-Extract Scope
    let detectedScope = '';
    const scopeMatch =
      text.match(/\bin\s+([a-zA-Z0-9_-]+)(?:\s+module|\s+component|\s+page|\s+service)?/i) ||
      text.match(/\bfor\s+([a-zA-Z0-9_-]+)(?:\s+module|\s+component|\s+page|\s+service)?/i) ||
      text.match(/(?:(?:module|component|service|page|scope|folder|dir):\s*([a-zA-Z0-9_-]+))/i) ||
      text.match(/(?:src\/|app\/|components\/|pages\/)([a-zA-Z0-9_-]+)/i);

    if (scopeMatch && scopeMatch[1]) {
      const candidate = scopeMatch[1].toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (candidate.length > 1 && !['the', 'a', 'an', 'all', 'our', 'new', 'this'].includes(candidate)) {
        detectedScope = candidate;
      }
    }

    if (!detectedScope) {
      if (lower.includes('login') || lower.includes('auth') || lower.includes('jwt') || lower.includes('session')) {
        detectedScope = 'auth';
      } else if (lower.includes('checkout') || lower.includes('cart') || lower.includes('payment')) {
        detectedScope = 'checkout';
      } else if (lower.includes('api') || lower.includes('endpoint') || lower.includes('route')) {
        detectedScope = 'api';
      } else if (lower.includes('settings') || lower.includes('preference')) {
        detectedScope = 'settings';
      } else if (lower.includes('nav') || lower.includes('header') || lower.includes('sidebar') || lower.includes('button') || lower.includes('ui')) {
        detectedScope = 'ui';
      } else if (lower.includes('deps') || lower.includes('package') || lower.includes('lodash')) {
        detectedScope = 'deps';
      }
    }

    // 3. Auto-Detect Breaking Changes
    let breaking = false;
    let breakingReason = '';
    const breakingMatch = lower.match(/(?:breaking\s+change|breaks|will\s+need\s+to\s+migrate|must\s+migrate|migration\s+required|removed\s+(?:old\s+|legacy\s+)?endpoints|removed\s+support|incompatible)/i);
    if (breakingMatch) {
      breaking = true;
      if (lower.includes('removed old endpoints') || lower.includes('migrate')) {
        breakingReason = 'old endpoints removed, clients must migrate';
      } else {
        const breakIdx = lower.indexOf(breakingMatch[0]);
        breakingReason = text.substring(breakIdx).replace(/^breaking\s+change:?\s*/i, '').trim();
      }
    }

    // 4. Auto-Extract Issues
    let issueRef = '';
    const issueMatch = text.match(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/i);
    if (issueMatch) {
      issueRef = issueMatch[0].trim();
      if (/^#\d+$/.test(issueRef)) {
        issueRef = (detectedType === 'fix' ? 'Fixes ' : 'Refs ') + issueRef;
      }
    }

    // 5. Build Subject Line
    let cleaned = text
      .replace(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/gi, '')
      .replace(/\b(?:in|for)\s+[a-zA-Z0-9_-]+(?:\s+module|\s+component|\s+page)?/gi, '')
      .replace(/^(?:i\s+(?:just\s+)?|we\s+(?:just\s+)?|just\s+|basically\s+|please\s+|finally\s+)/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Take primary clause if multiple clauses exist
    const firstClause = cleaned.split(/[,;\n]/)[0].trim();
    if (firstClause.length >= 8) {
      cleaned = firstClause;
    }

    cleaned = cleaned.replace(/[,.;:]+$/, '');

    // Convert verb to imperative
    const words = cleaned.split(' ');
    if (words.length > 0) {
      const firstWordLower = words[0].toLowerCase();
      if (IMPERATIVE_VERBS[firstWordLower]) {
        words[0] = IMPERATIVE_VERBS[firstWordLower];
      }
      cleaned = words.join(' ');
    }

    // Strip redundant "the" right after imperative verb
    cleaned = cleaned.replace(/^(fix|add|update|remove|implement|refactor|clean|bump|create)\s+the\s+/i, '$1 ');

    // Lowercase first char
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
    }

    let subject = cleaned;
    if (subject.length > 50) {
      const sub = subject.substring(0, 50);
      const lastSpace = sub.lastIndexOf(' ');
      if (lastSpace > 30) {
        subject = sub.substring(0, lastSpace);
      } else {
        subject = sub;
      }
    }

    // 6. Build Title / Header
    const scopePart = detectedScope ? `(${detectedScope})` : '';
    const breakingExcl = breaking ? '!' : '';
    const title = `${detectedType}${scopePart}${breakingExcl}: ${subject}`;

    // 7. Build Description (Body + Footers)
    let bodyText = text
      .replace(/(?:(?:fixes|closes|resolves|refs|see)\s*)?(#\d+|[A-Z]{2,}-\d+)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    bodyText = bodyText.replace(/[,.;:]+$/, '');

    let body = '';
    if (bodyText) {
      bodyText = bodyText.charAt(0).toUpperCase() + bodyText.slice(1) + '.';
      body = wordWrap(bodyText, 72);
    }

    const descParts: string[] = [];
    if (body) {
      descParts.push(body);
    }
    if (breaking) {
      const reason = breakingReason || 'Breaking changes introduced; migration required.';
      descParts.push(`BREAKING CHANGE: ${reason}`);
    }
    if (issueRef) {
      descParts.push(issueRef);
    }
    const description = descParts.join('\n\n');

    return {
      type: detectedType,
      scope: detectedScope,
      breaking,
      subject,
      title,
      description,
    };
  });

  // Effective Title (custom or auto)
  public displayTitle = computed(() => {
    return this.userCustomTitle() !== null
      ? (this.userCustomTitle() as string)
      : this.autoAnalysis().title;
  });

  // Effective Description (custom or auto)
  public displayDescription = computed(() => {
    return this.userCustomDescription() !== null
      ? (this.userCustomDescription() as string)
      : this.autoAnalysis().description;
  });

  // Full Commit Message (Title + blank line + Description)
  public fullCommitMessage = computed(() => {
    const t = this.displayTitle().trim();
    const d = this.displayDescription().trim();
    if (!t && !d) return '';
    if (t && d) return `${t}\n\n${d}`;
    return t || d;
  });

  // Git Command: git commit -m "title" -m "description"
  public gitCommand = computed(() => {
    const t = this.displayTitle().trim();
    const d = this.displayDescription().trim();
    if (!t) return 'git commit -m ""';

    let cmd = `git commit -m "${t.replace(/"/g, '\\"')}"`;
    if (d) {
      const paragraphs = d.split(/\n\s*\n/).filter((p) => p.trim());
      for (const p of paragraphs) {
        cmd += ` -m "${p.replace(/"/g, '\\"')}"`;
      }
    }
    return cmd;
  });

  public getTypeInfo(typeId: string): CommitTypeMeta {
    return COMMIT_TYPES_MAP[typeId] || COMMIT_TYPES_MAP['chore'];
  }

  public onRawInputChange(newVal: string): void {
    this.rawInput.set(newVal);
    this.userCustomTitle.set(null);
    this.userCustomDescription.set(null);
    this.activeEngine.set('rules');
    this.aiErrorMessage.set(null);
  }

  public onTitleChange(newVal: string): void {
    this.userCustomTitle.set(newVal);
  }

  public onDescriptionChange(newVal: string): void {
    this.userCustomDescription.set(newVal);
  }

  public clearAll(): void {
    this.rawInput.set('');
    this.userCustomTitle.set(null);
    this.userCustomDescription.set(null);
    this.activeEngine.set('rules');
    this.aiErrorMessage.set(null);
  }

  // Polish with Gemini AI
  public async polishWithAI(): Promise<void> {
    const input = this.rawInput().trim();
    if (!input) return;

    this.isAiLoading.set(true);
    this.aiErrorMessage.set(null);

    try {
      const response = await fetch(`${environment.apiUrl}/commit-generator/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: input,
          useAi: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.title) {
        this.userCustomTitle.set(data.title);
      }
      const descParts = [];
      if (data.body) descParts.push(data.body);
      if (data.footer) descParts.push(data.footer);
      this.userCustomDescription.set(descParts.join('\n\n'));

      this.activeEngine.set(data.engine === 'gemini' ? 'gemini' : 'rules');
    } catch (err: any) {
      console.warn('AI call failed, using rule engine:', err.message);
      this.aiErrorMessage.set('Could not reach Gemini service. Formatted via local engine.');
      this.activeEngine.set('rules');
    } finally {
      this.isAiLoading.set(false);
    }
  }

  // 1. Copy Title
  public async copyTitle(): Promise<void> {
    const text = this.displayTitle();
    if (!text) return;
    await this.copyText(text);
    this.copiedTitle.set(true);
    setTimeout(() => this.copiedTitle.set(false), 2000);
  }

  // 2. Copy Description
  public async copyDescription(): Promise<void> {
    const text = this.displayDescription();
    if (!text) return;
    await this.copyText(text);
    this.copiedDescription.set(true);
    setTimeout(() => this.copiedDescription.set(false), 2000);
  }

  // 3. Copy Full Message (Title + Description)
  public async copyFullMessage(): Promise<void> {
    const text = this.fullCommitMessage();
    if (!text) return;
    await this.copyText(text);
    this.copiedFull.set(true);
    setTimeout(() => this.copiedFull.set(false), 2000);
  }

  // 4. Copy Git Command
  public async copyGitCommand(): Promise<void> {
    const text = this.gitCommand();
    if (!text) return;
    await this.copyText(text);
    this.copiedGitCommand.set(true);
    setTimeout(() => this.copiedGitCommand.set(false), 2000);
  }

  private async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}
