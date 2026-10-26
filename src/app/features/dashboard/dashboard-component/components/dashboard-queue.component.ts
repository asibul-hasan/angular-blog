import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PendingTaskItem {
  id: string;
  internName: string;
  internEmail: string;
  domain: string;
  taskTitle: string;
  submissionUrl: string;
  submittedAt: string;
  status: string;
}

export interface CandidateApplicantItem {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  cvUrl?: string;
  status: 'applied' | 'shortlisted' | 'interviewed';
}

export interface EditorialDraftItem {
  id: string;
  title: string;
  category: string;
  author: string;
  updatedAt: string;
}

@Component({
  selector: 'app-dashboard-queue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 8 Columns: Operational Review Queue -->
      <div class="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div>
          <!-- Tab Navigation Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Operational Action Queue</h2>
              <p class="text-xs text-slate-400 mt-0.5">Tasks, candidates, and content requiring administrator input</p>
            </div>

            <!-- Tab Switcher -->
            <div class="inline-flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              <button
                type="button"
                (click)="activeTab.set('submissions')"
                [class]="activeTab() === 'submissions' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Intern Tasks</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" [class]="activeTab() === 'submissions' ? 'bg-black/20 text-slate-950' : 'bg-amber-500/20 text-amber-400'">
                  {{ pendingTasks.length }}
                </span>
              </button>

              <button
                type="button"
                (click)="activeTab.set('applications')"
                [class]="activeTab() === 'applications' 
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20' 
                  : 'text-slate-400 hover:text-slate-200'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Job Applicants</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" [class]="activeTab() === 'applications' ? 'bg-black/20 text-slate-950' : 'bg-sky-500/20 text-sky-400'">
                  {{ jobApplications.length }}
                </span>
              </button>

              <button
                type="button"
                (click)="activeTab.set('drafts')"
                [class]="activeTab() === 'drafts' 
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20' 
                  : 'text-slate-400 hover:text-slate-200'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Draft Articles</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" [class]="activeTab() === 'drafts' ? 'bg-black/20 text-slate-950' : 'bg-purple-500/20 text-purple-400'">
                  {{ editorialDrafts.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Tab Content 1: Intern Tasks Queue -->
          <div *ngIf="activeTab() === 'submissions'">
            <div *ngIf="pendingTasks.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left text-xs divide-y divide-slate-800">
                <thead>
                  <tr class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th class="py-2.5 px-3 font-semibold">Intern</th>
                    <th class="py-2.5 px-3 font-semibold">Domain</th>
                    <th class="py-2.5 px-3 font-semibold">Task Detail</th>
                    <th class="py-2.5 px-3 font-semibold">Submission Link</th>
                    <th class="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let item of pendingTasks" class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                          {{ item.internName.charAt(0) }}
                        </div>
                        <div>
                          <div class="font-bold text-white text-xs">{{ item.internName }}</div>
                          <div class="text-[10px] text-slate-400">{{ item.internEmail }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {{ item.domain }}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-medium text-slate-200">{{ item.taskTitle }}</div>
                      <div class="text-[10px] text-slate-500">Submitted {{ item.submittedAt }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <a
                        [href]="item.submissionUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        <span>Inspect Code</span>
                      </a>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <a
                        routerLink="/dashboard/intern-management/task-review"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <i class="fa-solid fa-check text-[10px]"></i>
                        Review
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State for Pending Tasks -->
            <div *ngIf="pendingTasks.length === 0" class="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3 text-lg">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <h3 class="text-sm font-bold text-white mb-1">Review Queue is Clear!</h3>
              <p class="text-xs text-slate-400 max-w-sm mb-4">All intern task submissions have been evaluated. Newly submitted work from the 16 active interns will appear here in real-time.</p>
              <a
                routerLink="/dashboard/intern-management/list"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <i class="fa-solid fa-users text-xs text-emerald-400"></i>
                <span>View Intern Roster</span>
              </a>
            </div>
          </div>

          <!-- Tab Content 2: Job Applications Queue -->
          <div *ngIf="activeTab() === 'applications'">
            <div *ngIf="jobApplications.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left text-xs divide-y divide-slate-800">
                <thead>
                  <tr class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th class="py-2.5 px-3 font-semibold">Candidate</th>
                    <th class="py-2.5 px-3 font-semibold">Position</th>
                    <th class="py-2.5 px-3 font-semibold">Applied</th>
                    <th class="py-2.5 px-3 font-semibold">Status</th>
                    <th class="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let item of jobApplications" class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                          {{ item.fullName.charAt(0) }}
                        </div>
                        <div>
                          <div class="font-bold text-white text-xs">{{ item.fullName }}</div>
                          <div class="text-[10px] text-slate-400">{{ item.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="font-medium text-slate-200">{{ item.jobTitle }}</span>
                    </td>
                    <td class="py-3 px-3 text-slate-400">
                      {{ item.appliedDate }}
                    </td>
                    <td class="py-3 px-3">
                      <span
                        class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        [ngClass]="{
                          'bg-sky-500/10 text-sky-400 border border-sky-500/20': item.status === 'applied',
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': item.status === 'shortlisted',
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20': item.status === 'interviewed'
                        }"
                      >
                        {{ item.status | titlecase }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <a
                        routerLink="/dashboard/job-management/job-applications"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State for Job Applications -->
            <div *ngIf="jobApplications.length === 0" class="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-3 text-lg">
                <i class="fa-solid fa-briefcase"></i>
              </div>
              <h3 class="text-sm font-bold text-white mb-1">No Open Applications</h3>
              <p class="text-xs text-slate-400 max-w-sm mb-4">No candidates have applied yet. Post or promote job openings to attract candidates.</p>
              <a
                routerLink="/dashboard/job-management/job/create"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Post New Opening</span>
              </a>
            </div>
          </div>

          <!-- Tab Content 3: Editorial Drafts Queue -->
          <div *ngIf="activeTab() === 'drafts'">
            <div *ngIf="editorialDrafts.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left text-xs divide-y divide-slate-800">
                <thead>
                  <tr class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th class="py-2.5 px-3 font-semibold">Article Title</th>
                    <th class="py-2.5 px-3 font-semibold">Category</th>
                    <th class="py-2.5 px-3 font-semibold">Author</th>
                    <th class="py-2.5 px-3 font-semibold">Last Modified</th>
                    <th class="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let item of editorialDrafts" class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3 px-3">
                      <div class="font-bold text-white text-xs max-w-xs truncate">{{ item.title }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {{ item.category }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-slate-300">
                      {{ item.author }}
                    </td>
                    <td class="py-3 px-3 text-slate-500">
                      {{ item.updatedAt }}
                    </td>
                    <td class="py-3 px-3 text-right">
                      <a
                        [routerLink]="['/dashboard/blog-management/blog/edit', item.id]"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold text-xs border border-purple-500/30 transition-colors cursor-pointer"
                      >
                        <i class="fa-solid fa-pen text-[10px]"></i>
                        Edit Draft
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State for Editorial Drafts -->
            <div *ngIf="editorialDrafts.length === 0" class="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3 text-lg">
                <i class="fa-solid fa-feather-pointed"></i>
              </div>
              <h3 class="text-sm font-bold text-white mb-1">All 33 Articles Published Live!</h3>
              <p class="text-xs text-slate-400 max-w-sm mb-4">There are currently 0 draft articles pending editorial review or approval.</p>
              <a
                routerLink="/dashboard/blog-management/blog/create"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-colors"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Write New Article</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer link -->
        <div class="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400">Total urgent action items: <span class="text-white font-bold">{{ pendingTasks.length + jobApplications.length + editorialDrafts.length }}</span></span>
          <a
            [routerLink]="activeTab() === 'submissions' ? '/dashboard/intern-management/task-review' : activeTab() === 'applications' ? '/dashboard/job-management/job-applications' : '/dashboard/blog-management/blogs'"
            class="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>View All in Management Portal</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>

      <!-- 4 Columns: Quick Actions & Live Alert Feed (Aidly PMS style) -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <!-- Quick Actions Grid -->
        <div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20">
          <div class="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Quick Actions</h2>
              <p class="text-xs text-slate-400">Frequent operational tasks</p>
            </div>
            <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <i class="fa-solid fa-bolt text-xs"></i>
            </div>
          </div>

          <!-- 2x3 Grid of Action Buttons -->
          <div class="grid grid-cols-2 gap-3">
            <a
              routerLink="/dashboard/blog-management/blog/create"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-purple-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-newspaper text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">New Article</span>
              <span class="text-[10px] text-slate-500">Create blog</span>
            </a>

            <a
              routerLink="/dashboard/job-management/job/create"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-briefcase text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">Post Job</span>
              <span class="text-[10px] text-slate-500">Hire talent</span>
            </a>

            <a
              routerLink="/dashboard/intern-management/task-review"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-check-double text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">Review Tasks</span>
              <span class="text-[10px] text-slate-500">Submissions</span>
            </a>

            <a
              routerLink="/dashboard/intern-management/list"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-users text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">Intern Roster</span>
              <span class="text-[10px] text-slate-500">Track batches</span>
            </a>

            <a
              routerLink="/dashboard/settings/user-access-management"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">User Access</span>
              <span class="text-[10px] text-slate-500">Manage roles</span>
            </a>

            <a
              routerLink="/dashboard/settings/company-management"
              class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-teal-500/40 transition-all group text-center cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-building text-sm"></i>
              </div>
              <span class="text-xs font-bold text-slate-200 group-hover:text-white">Company</span>
              <span class="text-[10px] text-slate-500">Organization</span>
            </a>
          </div>
        </div>

        <!-- Live Platform Alerts & Telemetry Feed -->
        <div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex-1">
          <div class="mb-3 pb-3 border-b border-slate-800 flex items-center justify-between">
            <h2 class="text-base font-bold text-white tracking-tight">System Alerts</h2>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">Live Feed</span>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-chart-line text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold text-slate-200">Google Analytics 4 Live</div>
                <div class="text-[10px] text-slate-400">147 views, 51 active readers tracked on Property 483080897.</div>
                <div class="text-[9px] text-teal-400 mt-1 font-mono">19.1% Engagement Rate</div>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-user-graduate text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold text-slate-200">16 Active Interns</div>
                <div class="text-[10px] text-slate-400">Enrolled across Python, Web Dev, ML, AI, & App Dev tracks.</div>
                <div class="text-[9px] text-emerald-400 mt-1 font-mono">Live Roster</div>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div class="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-briefcase text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold text-slate-200">Candidate Pipeline Active</div>
                <div class="text-[10px] text-slate-400">2 applications received for Junior Full-Stack Developer.</div>
                <div class="text-[9px] text-sky-400 mt-1 font-mono">1 Shortlisted</div>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-newspaper text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold text-slate-200">33 Published Articles</div>
                <div class="text-[10px] text-slate-400">Content database fully indexed and synced in MongoDB Atlas.</div>
                <div class="text-[9px] text-purple-400 mt-1 font-mono">100% Live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardQueueComponent {
  activeTab = signal<'submissions' | 'applications' | 'drafts'>('submissions');

  @Input() pendingTasks: PendingTaskItem[] = [];
  @Input() jobApplications: CandidateApplicantItem[] = [];
  @Input() editorialDrafts: EditorialDraftItem[] = [];
}

