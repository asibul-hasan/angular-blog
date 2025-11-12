import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService, Company } from '../../../../../shared/services/company/company.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CompanyModalComponent } from './modals/company-modal/company-modal.component';
import { UtilityService } from '../../../../../shared/services/utility.service';

@Component({
    selector: 'app-company-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule],
    templateUrl: './company-management.component.html',
    styleUrl: './company-management.component.css'
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    isLoading = false;
    searchTerm = '';

    constructor(
        private companyService: CompanyService,
        private toastService: ToastService,
        private utilityService: UtilityService
    ) { }

    ngOnInit(): void {
        this.loadCompanies();
    }

    loadCompanies() {
        this.isLoading = true;
        this.companyService.getCompanies().subscribe({
            next: (response: { body: Company[] }) => {
                this.isLoading = false;
                this.companies = response.body || [];
                this.filteredCompanies = [...this.companies];
            },
            error: (error: any) => {
                this.isLoading = false;
                this.toastService.error('Error', 'Failed to load companies');
                console.error(error);
            }
        });
    }

    searchCompanies() {
        if (!this.searchTerm) {
            this.filteredCompanies = [...this.companies];
            return;
        }

        const term = this.searchTerm.toLowerCase();
        this.filteredCompanies = this.companies.filter(company =>
            company.name.toLowerCase().includes(term) ||
            company.legalName?.toLowerCase().includes(term) ||
            company.industry?.toLowerCase().includes(term) ||
            company.contact?.email?.toLowerCase().includes(term)
        );
    }

    openCreateModal() {
        this.utilityService.openDialog(CompanyModalComponent, {
            company: null,
            mode: 'create'
        }, 'xl').subscribe(result => {
            if (result) {
                this.loadCompanies(); // Refresh the list
            }
        });
    }

    openEditModal(company: Company) {
        this.utilityService.openDialog(CompanyModalComponent, {
            company: { ...company },
            mode: 'edit'
        }, 'lg').subscribe(result => {
            if (result) {
                this.loadCompanies(); // Refresh the list
            }
        });
    }

    openViewModal(company: Company) {
        this.utilityService.openDialog(CompanyModalComponent, {
            company: { ...company },
            mode: 'view'
        }, 'lg').subscribe(result => {
            // No need to refresh for view
        });
    }

    deleteCompany(company: Company) {
        if (!company._id) return;

        if (confirm(`Are you sure you want to delete ${company.name}?`)) {
            this.companyService.deleteCompany(company._id).subscribe({
                next: () => {
                    this.toastService.success('Success', 'Company deleted successfully');
                    this.loadCompanies(); // Refresh the list
                },
                error: (error: any) => {
                    this.toastService.error('Error', 'Failed to delete company');
                    console.error(error);
                }
            });
        }
    }
}