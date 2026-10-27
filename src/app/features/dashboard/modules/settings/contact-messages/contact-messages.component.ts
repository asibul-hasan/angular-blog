import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService, ContactMessage } from '../../../../../shared/services/contact/contact.service';
import { ToastService } from '../../../../../core/services';

@Component({
  selector: 'app-contact-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-messages.component.html',
  styleUrl: './contact-messages.component.css'
})
export class ContactMessagesComponent implements OnInit {
  private readonly contactService = inject(ContactService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  isLoading = false;
  currentFilter: 'all' | 'unread' | 'read' | 'replied' | 'archived' = 'all';
  searchTerm = '';

  selectedMessage: ContactMessage | null = null;
  showDetailModal = false;
  showCreateModal = false;
  isSaving = false;
  adminNotesInput = '';

  readonly serviceOptions = [
    'Custom Software & SME ERP (Aidly)',
    'Full-Stack Web & Cloud Infrastructure',
    'Mobile Applications (iOS & Android)',
    'AI, LLM Integration & Automation',
    'UI/UX Product Architecture & Design',
    'Technical Architecture & Advisory',
    'Other General Inquiry / Partnership',
  ];

  readonly createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    serviceInterest: ['Custom Software & SME ERP (Aidly)', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    status: ['unread'],
    adminNotes: [''],
  });

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.contactService.getContactMessages().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.messages = res.body || [];
        this.applyFilter(this.currentFilter);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load contact messages:', err);
        this.toast.error('Load Error', err?.error?.message || 'Failed to retrieve contact messages.');
      }
    });
  }

  get totalCount(): number {
    return this.messages.length;
  }

  get unreadCount(): number {
    return this.messages.filter(m => (m.status || 'unread') === 'unread').length;
  }

  get readCount(): number {
    return this.messages.filter(m => m.status === 'read').length;
  }

  get repliedCount(): number {
    return this.messages.filter(m => m.status === 'replied').length;
  }

  get archivedCount(): number {
    return this.messages.filter(m => m.status === 'archived').length;
  }

  applyFilter(filter: 'all' | 'unread' | 'read' | 'replied' | 'archived'): void {
    this.currentFilter = filter;
    let list = this.messages;

    if (filter !== 'all') {
      list = list.filter(m => (m.status || 'unread') === filter);
    }

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(m =>
        m.name?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.subject?.toLowerCase().includes(term) ||
        m.message?.toLowerCase().includes(term) ||
        m.phone?.toLowerCase().includes(term) ||
        m.serviceInterest?.toLowerCase().includes(term)
      );
    }

    this.filteredMessages = list;
  }

  searchMessages(): void {
    this.applyFilter(this.currentFilter);
  }

  openDetailModal(msg: ContactMessage): void {
    this.selectedMessage = { ...msg };
    this.adminNotesInput = msg.adminNotes || '';
    this.showDetailModal = true;

    // If message is unread, mark as read in background
    if ((msg.status || 'unread') === 'unread' && msg._id) {
      this.contactService.updateMessageStatus(msg._id, 'read').subscribe({
        next: (res) => {
          msg.status = 'read';
          if (this.selectedMessage) this.selectedMessage.status = 'read';
        },
        error: (err) => console.error('Status update failed:', err)
      });
    }
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedMessage = null;
    this.adminNotesInput = '';
  }

  openCreateModal(): void {
    this.createForm.reset({
      name: '',
      email: '',
      phone: '',
      subject: '',
      serviceInterest: 'Custom Software & SME ERP (Aidly)',
      message: '',
      status: 'unread',
      adminNotes: '',
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  submitManualMessage(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.toast.warn('Validation', 'Please fill in all required fields.');
      return;
    }

    this.isSaving = true;
    const formVals = this.createForm.value;
    const payload: ContactMessage = {
      name: formVals.name!,
      email: formVals.email!,
      phone: formVals.phone || '',
      subject: formVals.subject!,
      serviceInterest: formVals.serviceInterest!,
      message: formVals.message!,
      status: (formVals.status as any) || 'unread',
      adminNotes: formVals.adminNotes || '',
    };

    this.contactService.sendContactMessage(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.toast.success('Inquiry Logged', 'Message recorded successfully in system.');
        this.closeCreateModal();
        this.loadMessages();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to save manual message:', err);
        this.toast.error('Error', err?.error?.message || 'Failed to record message.');
      }
    });
  }

  updateStatus(msg: ContactMessage, newStatus: string): void {
    if (!msg._id) return;
    this.contactService.updateMessageStatus(msg._id, newStatus).subscribe({
      next: () => {
        msg.status = newStatus as any;
        if (this.selectedMessage && this.selectedMessage._id === msg._id) {
          this.selectedMessage.status = newStatus as any;
        }
        this.toast.success('Updated', `Message status changed to ${newStatus}`);
        this.applyFilter(this.currentFilter);
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.toast.error('Error', 'Failed to update message status.');
      }
    });
  }

  saveAdminNotes(): void {
    if (!this.selectedMessage || !this.selectedMessage._id) return;
    this.isSaving = true;
    this.contactService.updateMessageStatus(this.selectedMessage._id, this.selectedMessage.status || 'read', this.adminNotesInput).subscribe({
      next: () => {
        this.isSaving = false;
        this.selectedMessage!.adminNotes = this.adminNotesInput;
        const found = this.messages.find(m => m._id === this.selectedMessage!._id);
        if (found) found.adminNotes = this.adminNotesInput;
        this.toast.success('Saved', 'Admin notes recorded.');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to save admin notes:', err);
        this.toast.error('Error', 'Failed to save admin notes.');
      }
    });
  }

  deleteMessage(msg: ContactMessage): void {
    if (!msg._id) return;
    if (!confirm(`Are you sure you want to delete message from "${msg.name}"?`)) return;

    this.contactService.deleteContactMessage(msg._id).subscribe({
      next: () => {
        this.toast.success('Deleted', 'Contact message removed.');
        this.messages = this.messages.filter(m => m._id !== msg._id);
        this.applyFilter(this.currentFilter);
        if (this.selectedMessage && this.selectedMessage._id === msg._id) {
          this.closeDetailModal();
        }
      },
      error: (err) => {
        console.error('Failed to delete message:', err);
        this.toast.error('Error', 'Failed to delete message.');
      }
    });
  }

  getMailtoLink(msg: ContactMessage): string {
    const subject = encodeURIComponent(`Re: ${msg.subject || 'Inquiry with InfoAidTech'}`);
    return `mailto:${msg.email}?subject=${subject}`;
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'unread':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'read':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'replied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'archived':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  }
}
