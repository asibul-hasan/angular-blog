import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SeoService } from '../../../../shared/services/seo/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../shared';
import { ToastService } from '../../../../core/services';
import { InternService } from '../../../../shared/services';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';
import { UpperSectionComponent } from '../../../../shared/components/template/cards/page-upper-section.component';

@Component({
    selector: 'app-internship-apply',
    standalone: true,
    imports: [...SHARED_IMPORTS, ReactiveFormsModule, UpperSectionComponent, CommonModule],
    templateUrl: './internship-apply.component.html',
    styleUrl: './internship-apply.component.css',
})
export class InternshipApplyComponent {
    internshipForm: FormGroup;
    currentYearOptions = APP_CONSTANTS.CURRENT_YEAR_OPTIONS;
    preferredDomainOptions = APP_CONSTANTS.PREFERRED_DOMAIN_OPTIONS;
    skillLevelOptions = APP_CONSTANTS.SKILL_LEVEL_OPTIONS;
    sourceOptions = APP_CONSTANTS.SOURCE_OPTIONS;

    isSubmitting = false;
    selectedFileName = '';
    selectedFileSize = '';

    readonly requiredFields = [
        'fullName', 'email', 'whatsapp', 'dateOfBirth', 'country',
        'college', 'qualification', 'currentYear', 'preferredDomain',
        'skillLevel', 'linkedinProfile', 'source'
    ];

    constructor(
        private router: Router,
        private seo: SeoService,
        private fb: FormBuilder,
        private toast: ToastService,
        private internService: InternService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        // SEO tags
        this.seo.updateTags({
            title: 'Apply for Internship — Kickstart Your Tech Career | InfoAidTech',
            description:
                'Apply for an internship at InfoAidTech. Gain hands-on engineering experience in Web Development, Machine Learning, Python, Java, AI, and App Development.',
            image:
                'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
            url: 'https://infoaidtech.net/internship/apply',
            type: 'website',
            keywords: 'internship apply, tech internship, software intern, web developer internship, InfoAidTech internship, remote internship 2026',
        });

        this.seo.addBreadcrumbs([
            { name: 'Home', url: 'https://infoaidtech.net' },
            { name: 'Careers', url: 'https://infoaidtech.net/careers' },
            { name: 'Apply for Internship', url: 'https://infoaidtech.net/internship/apply' },
        ]);

        // Initialize form
        this.internshipForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            dateOfBirth: ['', [Validators.required]],
            country: ['', [Validators.required]],
            whatsapp: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{7,20}$/)]],
            college: ['', [Validators.required, Validators.minLength(2)]],
            qualification: ['', [Validators.required]],
            currentYear: ['', [Validators.required]],
            preferredDomain: ['', [Validators.required]],
            skillLevel: ['', [Validators.required]],
            linkedinProfile: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.+/i)]],
            source: ['', [Validators.required]],
            telegram: [''],
            facebook: [''],
            instagram: [''],
            youtubeLink: [''],
            youtubeScreenshot: [''],
            queries: ['']
        });
    }

    get completedRequiredCount(): number {
        return this.requiredFields.filter(key => {
            const ctrl = this.internshipForm.get(key);
            return ctrl && ctrl.valid && ctrl.value !== '' && ctrl.value !== null;
        }).length;
    }

    get totalRequiredCount(): number {
        return this.requiredFields.length;
    }

    get completionPercentage(): number {
        return Math.round((this.completedRequiredCount / this.totalRequiredCount) * 100);
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.internshipForm.get(fieldName);
        return !!(control && control.invalid && (control.touched || control.dirty));
    }

    getFieldError(fieldName: string): string {
        const control = this.internshipForm.get(fieldName);
        if (!control || !control.errors) return '';
        if (control.errors['required']) return 'This field is required';
        if (control.errors['email']) return 'Please enter a valid email address';
        if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
        if (control.errors['pattern']) {
            if (fieldName === 'whatsapp') return 'Enter a valid phone number (e.g. +1 234 567 8900)';
            if (fieldName === 'linkedinProfile') return 'Enter a valid LinkedIn URL (https://linkedin.com/in/...)';
            return 'Invalid format';
        }
        return 'Invalid input';
    }

    onFileSelected(event: any, controlName: string): void {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                this.toast.warn('File Size Exceeded', 'Please upload an image smaller than 5 MB.');
                return;
            }
            this.selectedFileName = file.name;
            const sizeInKb = Math.round(file.size / 1024);
            this.selectedFileSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
            this.toast.info('File Attached', `${file.name} ready for verification.`);
            this.internshipForm.patchValue({
                [controlName]: file.name
            });
        }
    }

    removeFile(controlName: string, fileInput?: HTMLInputElement): void {
        this.selectedFileName = '';
        this.selectedFileSize = '';
        this.internshipForm.patchValue({
            [controlName]: ''
        });
        if (fileInput) {
            fileInput.value = '';
        }
    }

    onSubmit(): void {
        if (this.internshipForm.valid) {
            this.isSubmitting = true;
            
            const formVals = this.internshipForm.value;
            const payload = {
                name: formVals.fullName,
                email: formVals.email,
                phone: formVals.whatsapp,
                domain: formVals.preferredDomain,
                college: formVals.college,
                qualification: formVals.qualification,
                currentYear: formVals.currentYear,
                skillLevel: formVals.skillLevel,
                linkedinProfile: formVals.linkedinProfile,
                country: formVals.country,
                dateOfBirth: formVals.dateOfBirth,
                source: formVals.source,
                telegram: formVals.telegram || '',
                queries: formVals.queries || '',
                youtubeScreenshot: formVals.youtubeScreenshot || ''
            };

            this.internService.applyForInternship(payload)
                .subscribe({
                    next: (res) => {
                        this.isSubmitting = false;
                        this.toast.success('Success', res.message || 'Application submitted successfully! Check your email for next steps.');
                        this.internshipForm.reset();
                        this.selectedFileName = '';
                        this.selectedFileSize = '';
                    },
                    error: (err) => {
                        this.isSubmitting = false;
                        const errorMsg = err.error?.message || 'Failed to submit application. Please try again.';
                        this.toast.warn('Error', errorMsg);
                    }
                });
        } else {
            this.internshipForm.markAllAsTouched();
            this.toast.warn('Validation', 'Please fill in all 12 required fields correctly before submitting.');
        }
    }
}