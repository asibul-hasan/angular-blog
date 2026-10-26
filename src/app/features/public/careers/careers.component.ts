import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../shared/services/job/job.service';
import { SeoService } from '../../../shared/services/seo/seo.service';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css'],
})
export class CareersComponent implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly seo = inject(SeoService);

  jobs: any[] = [];
  filteredJobs: any[] = [];
  loading = true;
  searchTerm = '';
  selectedDepartment = '';
  selectedLocation = '';

  departments: string[] = [];
  locations: string[] = [];

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Careers & Opportunities — Join Our Team',
      description: 'Explore exciting career opportunities, software engineering roles, and internships at InfoAidTech. Build modern web, mobile, and cloud solutions with us.',
      url: 'https://infoaidtech.net/careers',
      type: 'website',
      keywords: 'careers, jobs, software engineer jobs, web developer careers, tech internships, InfoAidTech hiring',
    });
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (response) => {
        // Filter to only show published jobs
        this.jobs = (response.body || []).filter((job: any) => job.isPublished);
        this.filteredJobs = [...this.jobs];
        this.extractFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
        this.loading = false;
      },
    });
  }

  extractFilters(): void {
    this.departments = [...new Set(this.jobs.map(job => job.job))];
    this.locations = [...new Set(this.jobs.map(job => job.location))];
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm ||
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesDepartment = !this.selectedDepartment || job.job === this.selectedDepartment;
      const matchesLocation = !this.selectedLocation || job.location === this.selectedLocation;

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedLocation = '';
    this.filteredJobs = [...this.jobs];
  }

  getJobsByLocation(location: string): any[] {
    return this.filteredJobs.filter(job => job.location === location);
  }

  isJobExpired(job: any): boolean {
    if (!job.expired) return false;
    const expiryDate = new Date(job.expired);
    const today = new Date();
    return expiryDate < today;
  }

  isJobAvailable(job: any): boolean {
    return job.isPublished && !this.isJobExpired(job);
  }
}