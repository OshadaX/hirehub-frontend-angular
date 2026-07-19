import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService, Job } from '../../services/jobs.service';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-job-details',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobsService = inject(JobsService);
  private applicationsService = inject(ApplicationsService);

  job: Job | null = null;
  isLoading = true;
  errorMessage = '';
  showModal = false;

  // Application form fields
  coverLetter = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobsService.getJobById(id).subscribe({
        next: (data) => {
          this.job = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load job details.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  toggleApplyModal(show: boolean) {
    this.showModal = show;
    this.submitSuccess = false;
    this.submitError = '';
  }

  submitApplication() {
    if (!this.job) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.submitError = 'You must be logged in to apply.';
      return;
    }
    if (!this.coverLetter.trim()) {
      this.submitError = 'Please write a cover letter.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.applicationsService.createApplication({
      jobId: this.job.id,
      userId: userId,
      coverLetter: this.coverLetter
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.coverLetter = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error || 'Failed to submit application.';
        console.error(err);
      }
    });
  }

  formatSalary(salary: number): string {
    if (!salary) return 'Negotiable';
    return '$' + salary.toLocaleString() + ' / yr';
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const past = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }
}
