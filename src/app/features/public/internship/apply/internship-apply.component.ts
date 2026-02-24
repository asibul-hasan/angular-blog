import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../shared/services/seo/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../shared';
import { ToastService } from '../../../../core/services';
import { InternService } from '../../../../shared/services';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Component({
    selector: 'app-internship-apply',
    standalone: true,
    imports: [...SHARED_IMPORTS, ReactiveFormsModule],
    templateUrl: './internship-apply.component.html',
    styleUrl: './internship-apply.component.css',
})
export class InternshipApplyComponent {
    internshipForm: FormGroup;
    currentYearOptions = APP_CONSTANTS.CURRENT_YEAR_OPTIONS;
    preferredDomainOptions = APP_CONSTANTS.PREFERRED_DOMAIN_OPTIONS;
    skillLevelOptions = APP_CONSTANTS.SKILL_LEVEL_OPTIONS;
    sourceOptions = APP_CONSTANTS.SOURCE_OPTIONS;

    constructor(
        private router: Router,
        private seo: SeoService,
        private fb: FormBuilder,
        private toast: ToastService,
        private internService: InternService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        let origin = '';

        if (isPlatformBrowser(this.platformId)) {
            origin = window.location.origin;
        }

        // SEO tags
        this.seo.updateTags({
            title: 'Apply for Internship',
            description:
                'Apply for an internship at InfoAidTech and kickstart your career in technology.',
            image:
                'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
            slug: origin,
            type: 'website',
        });

        // Initialize form
        this.internshipForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            dateOfBirth: ['', [Validators.required]],
            country: ['', [Validators.required]],
            whatsapp: ['', [Validators.required]],
            college: ['', [Validators.required]],
            qualification: ['', [Validators.required]],
            currentYear: ['', [Validators.required]],
            preferredDomain: ['', [Validators.required]],
            skillLevel: ['', [Validators.required]],
            linkedinProfile: ['', [Validators.required]],
            source: ['', [Validators.required]],
            telegram: [''],
            facebook: [''],
            instagram: [''],
            youtubeLink: [''],
            youtubeScreenshot: [''],
            queries: ['']
        });
    }

    isSubmitting = false;

    onSubmit(): void {
        if (this.internshipForm.valid) {
            this.isSubmitting = true;
            
            const formVals = this.internshipForm.value;
            const payload = {
                name: formVals.fullName,
                email: formVals.email,
                phone: formVals.whatsapp,
                domain: formVals.preferredDomain
            };

            this.internService.applyForInternship(payload)
                .subscribe({
                    next: (res) => {
                        this.isSubmitting = false;
                        this.toast.success('Success', res.message || 'Application submitted successfully! Check your email.');
                        this.internshipForm.reset();
                    },
                    error: (err) => {
                        this.isSubmitting = false;
                        const errorMsg = err.error?.message || 'Failed to submit application.';
                        this.toast.warn('Error', errorMsg);
                    }
                });
        } else {
            this.internshipForm.markAllAsTouched();
            this.toast.warn('Validation', 'Please fill in all required fields correctly.');
        }
    }

    onFileSelected(event: any, controlName: string): void {
        const file = event.target.files[0];
        if (file) {
            // In a real application, you would upload the file to your server
            // For now, we'll just show a success message
            this.toast.info('File Selected', `${file.name} has been selected.`);
            // Store file info in form control
            this.internshipForm.patchValue({
                [controlName]: file.name
            });
        }
    }
}