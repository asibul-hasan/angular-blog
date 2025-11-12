import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompanyService, Company } from '../../../../../../../shared/services/company/company.service';
import { ToastService } from '../../../../../../../shared/services/toast.service';

@Component({
    selector: 'app-company-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule
    ],
    templateUrl: './company-modal.component.html',
    styleUrls: ['./company-modal.component.css']
})
export class CompanyModalComponent {
    companyForm: FormGroup;
    isEditMode: boolean;
    isViewMode: boolean;
    isLoading = false;

    companyTypes = [
        'Private Limited',
        'Public Limited',
        'LLC',
        'Corporation',
        'Partnership',
        'Proprietorship',
        'Other'
    ];

    statuses = ['Active', 'Inactive', 'Suspended'];
    currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];

    constructor(
        private fb: FormBuilder,
        private companyService: CompanyService,
        private toastService: ToastService,
        public dialogRef: MatDialogRef<CompanyModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { company: Company | null, mode: 'create' | 'edit' | 'view' }
    ) {
        this.isEditMode = this.data.mode === 'edit';
        this.isViewMode = this.data.mode === 'view';

        this.companyForm = this.createForm();

        if (this.data.company) {
            this.populateForm(this.data.company);
        }

        if (this.isViewMode) {
            this.companyForm.disable();
        }
    }

    createForm() {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            legalName: [''],
            type: ['Private Limited'],
            industry: [''],
            foundedDate: [''],
            logoUrl: [''],
            status: ['Active'],

            // Address
            'address.addressLine1': [''],
            'address.addressLine2': [''],
            'address.city': [''],
            'address.state': [''],
            'address.country': [''],
            'address.postalCode': [''],
            'address.timezone': [''],

            // Contact
            'contact.email': [''],
            'contact.phone': [''],
            'contact.website': [''],
            'contact.linkedin': [''],
            'contact.twitter': [''],

            // Financial
            registrationNumber: [''],
            taxId: [''],
            currency: ['USD'],
            fiscalYearStart: [''],
            fiscalYearEnd: [''],

            // Metadata
            'meta.tags': [''],
            'meta.notes': ['']
        });
    }

    populateForm(company: Company) {
        this.companyForm.patchValue({
            name: company.name,
            legalName: company.legalName,
            type: company.type,
            industry: company.industry,
            foundedDate: company.foundedDate,
            logoUrl: company.logoUrl,
            status: company.status,

            // Address
            'address.addressLine1': company.address?.addressLine1,
            'address.addressLine2': company.address?.addressLine2,
            'address.city': company.address?.city,
            'address.state': company.address?.state,
            'address.country': company.address?.country,
            'address.postalCode': company.address?.postalCode,
            'address.timezone': company.address?.timezone,

            // Contact
            'contact.email': company.contact?.email,
            'contact.phone': company.contact?.phone,
            'contact.website': company.contact?.website,
            'contact.linkedin': company.contact?.linkedin,
            'contact.twitter': company.contact?.twitter,

            // Financial
            registrationNumber: company.registrationNumber,
            taxId: company.taxId,
            currency: company.currency,
            fiscalYearStart: company.fiscalYearStart,
            fiscalYearEnd: company.fiscalYearEnd,

            // Metadata
            'meta.tags': company.meta?.tags?.join(', '),
            'meta.notes': company.meta?.notes
        });
    }

    transformFormData(formData: any) {
        const data: any = {};

        // Copy simple fields
        Object.keys(formData).forEach(key => {
            if (!key.includes('.')) {
                data[key] = formData[key];
            }
        });

        // Handle nested address object
        if (formData['address.addressLine1'] || formData['address.addressLine2'] ||
            formData['address.city'] || formData['address.state'] ||
            formData['address.country'] || formData['address.postalCode'] ||
            formData['address.timezone']) {
            data.address = {
                addressLine1: formData['address.addressLine1'],
                addressLine2: formData['address.addressLine2'],
                city: formData['address.city'],
                state: formData['address.state'],
                country: formData['address.country'],
                postalCode: formData['address.postalCode'],
                timezone: formData['address.timezone']
            };
        }

        // Handle nested contact object
        if (formData['contact.email'] || formData['contact.phone'] ||
            formData['contact.website'] || formData['contact.linkedin'] ||
            formData['contact.twitter']) {
            data.contact = {
                email: formData['contact.email'],
                phone: formData['contact.phone'],
                website: formData['contact.website'],
                linkedin: formData['contact.linkedin'],
                twitter: formData['contact.twitter']
            };
        }

        // Handle nested meta object
        if (formData['meta.tags'] || formData['meta.notes']) {
            data.meta = {
                tags: formData['meta.tags'] ? formData['meta.tags'].split(',').map((tag: string) => tag.trim()) : [],
                notes: formData['meta.notes']
            };
        }

        return data;
    }

    onSubmit(): void {
        if (this.companyForm.invalid) {
            this.toastService.error('Validation Error', 'Please fill in all required fields');
            return;
        }

        this.isLoading = true;
        const formData = this.companyForm.value;
        const companyData = this.transformFormData(formData);

        if (this.data.mode === 'create') {
            this.companyService.createCompany(companyData).subscribe({
                next: (response: { body: Company }) => {
                    this.isLoading = false;
                    this.toastService.success('Success', 'Company created successfully');
                    this.dialogRef.close(response.body);
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.toastService.error('Error', 'Failed to create company');
                    console.error(error);
                }
            });
        } else if (this.data.mode === 'edit' && this.data.company?._id) {
            this.companyService.updateCompany(this.data.company._id, companyData).subscribe({
                next: (response: { body: Company }) => {
                    this.isLoading = false;
                    this.toastService.success('Success', 'Company updated successfully');
                    this.dialogRef.close(response.body);
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.toastService.error('Error', 'Failed to update company');
                    console.error(error);
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.companyForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    closeModal(): void {
        this.dialogRef.close();
    }
}