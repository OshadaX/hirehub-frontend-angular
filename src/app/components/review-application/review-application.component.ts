import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationsService, ApplicationResponse } from '../../services/applications.service';

// Status enum mirrors the backend ApplicationStatus enum
const STATUS_MAP: Record<number, string> = {
  0: 'Pending',
  1: 'Reviewed',
  2: 'Accepted',
  3: 'Rejected'
};

@Component({
  selector: 'app-review-application',
  imports: [RouterLink, CommonModule],
  templateUrl: './review-application.component.html',
  styleUrl: './review-application.component.css'
})
export class ReviewApplicationComponent implements OnInit {
  private applicationsService = inject(ApplicationsService);

  applications: ApplicationResponse[] = [];
  isLoading = true;
  errorMessage = '';
  updatingId: string | null = null;

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.applicationsService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load applications.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateStatus(app: ApplicationResponse, status: number) {
    this.updatingId = app.id;
    this.applicationsService.updateStatus(app.id, status).subscribe({
      next: () => {
        app.status = STATUS_MAP[status] || String(status);
        this.updatingId = null;
      },
      error: (err) => {
        console.error(err);
        this.updatingId = null;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'accepted' || s === '2') return 'bg-green-100 text-green-800';
    if (s === 'rejected' || s === '3') return 'bg-red-100 text-red-800';
    if (s === 'reviewed' || s === '1') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800'; // Pending
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  logout() {
    localStorage.clear();
  }
}
