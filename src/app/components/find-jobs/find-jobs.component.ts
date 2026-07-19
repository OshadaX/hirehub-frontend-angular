import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService, Job } from '../../services/jobs.service';

@Component({
  selector: 'app-find-jobs',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './find-jobs.component.html',
  styleUrl: './find-jobs.component.css'
})
export class FindJobsComponent implements OnInit {
  private jobsService = inject(JobsService);

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = true;
  errorMessage = '';
  searchQuery = '';
  locationQuery = '';

  // Logged-in user info
  userName = localStorage.getItem('fullName') || 'User';

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobsService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filteredJobs = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load jobs. Please try again.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    const loc = this.locationQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (!q || job.title.toLowerCase().includes(q) || job.companyName.toLowerCase().includes(q)) &&
      (!loc || job.location.toLowerCase().includes(loc))
    );
  }

  logout() {
    localStorage.clear();
  }

  formatSalary(salary: number): string {
    if (!salary) return 'Negotiable';
    return '$' + (salary / 1000).toFixed(0) + 'k';
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  }
}
