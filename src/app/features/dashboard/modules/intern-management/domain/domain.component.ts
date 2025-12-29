import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../../shared';

interface Domain {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

@Component({
    selector: 'app-domain',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ...SHARED_IMPORTS],
    templateUrl: './domain.component.html',
    styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
    domainForm: FormGroup;
    domains: Domain[] = [];
    isEditing = false;
    currentDomainId: string | null = null;

    constructor(private fb: FormBuilder) {
        this.domainForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit(): void {
        this.loadDomains();
    }

    loadDomains(): void {
        // In a real application, this would come from an API
        // For now, we'll use mock data
        this.domains = [
            {
                id: '1',
                name: 'Web Development',
                description: 'Frontend and backend web development including HTML, CSS, JavaScript, and frameworks',
                createdAt: new Date()
            },
            {
                id: '2',
                name: 'Mobile App Development',
                description: 'Native and cross-platform mobile application development',
                createdAt: new Date()
            },
            {
                id: '3',
                name: 'Data Science',
                description: 'Data analysis, machine learning, and artificial intelligence',
                createdAt: new Date()
            }
        ];
    }

    onSubmit(): void {
        if (this.domainForm.valid) {
            if (this.isEditing && this.currentDomainId) {
                this.updateDomain(this.currentDomainId);
            } else {
                this.createDomain();
            }
        }
    }

    createDomain(): void {
        const newDomain: Domain = {
            id: Date.now().toString(),
            name: this.domainForm.value.name,
            description: this.domainForm.value.description,
            createdAt: new Date()
        };

        this.domains.push(newDomain);
        this.resetForm();
    }

    editDomain(domain: Domain): void {
        this.isEditing = true;
        this.currentDomainId = domain.id;
        this.domainForm.patchValue({
            name: domain.name,
            description: domain.description
        });
    }

    updateDomain(id: string): void {
        const index = this.domains.findIndex(d => d.id === id);
        if (index !== -1) {
            this.domains[index] = {
                ...this.domains[index],
                name: this.domainForm.value.name,
                description: this.domainForm.value.description
            };
        }
        this.resetForm();
    }

    deleteDomain(id: string): void {
        this.domains = this.domains.filter(d => d.id !== id);
    }

    resetForm(): void {
        this.domainForm.reset();
        this.isEditing = false;
        this.currentDomainId = null;
    }
}