import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../shared/services/seo/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../shared';
import { ToastService } from '../../../../core/services';

@Component({
    selector: 'app-internship-apply',
    standalone: true,
    imports: [...SHARED_IMPORTS, ReactiveFormsModule],
    templateUrl: './internship-apply.component.html',
    styleUrl: './internship-apply.component.css',
})
export class InternshipApplyComponent {
    internshipForm: FormGroup;
    currentYearOptions = [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
        { value: 'other', label: 'Other' }
    ];

    preferredDomainOptions = [
        { value: 'web-development', label: 'Web Development' },
        { value: 'app-development', label: 'App Development' },
        { value: 'machine-learning', label: 'Machine Learning' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
        { value: 'graphics-design', label: 'Graphics and Logo Design' }
    ];

    skillLevelOptions = [
        { value: '1', label: '1 - Beginner' },
        { value: '2', label: '2 - Basic' },
        { value: '3', label: '3 - Intermediate' },
        { value: '4', label: '4 - Advanced' },
        { value: '5', label: '5 - Expert' }
    ];

    sourceOptions = [
        { value: 'social-media', label: 'Social Media ( Instagram, LinkedIn, etc.)' },
        { value: 'referral', label: 'Referral (Friends, Colleagues, Relatives etc.)' },
        { value: 'other', label: 'Other' }
    ];

    constructor(
        private router: Router,
        private seo: SeoService,
        private fb: FormBuilder,
        private toast: ToastService,
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

    onSubmit(): void {
        if (this.internshipForm.valid) {
            // In a real application, you would send this data to your backend
            console.log('Internship Application:', this.internshipForm.value);

            this.toast.success('Success', 'Your application has been submitted successfully!');
            this.internshipForm.reset();
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