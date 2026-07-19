import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobsService, Job } from '../../services/jobs.service';
import { ApplicationsService, ApplicationResponse } from '../../services/applications.service';

@Component({
  selector: 'app-employee-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit {
  private jobsService = inject(JobsService);
  private applicationsService = inject(ApplicationsService);

  jobs: Job[] = [];
  applications: ApplicationResponse[] = [];
  isLoading = true;

  userName = localStorage.getItem('fullName') || 'Employer';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.jobsService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.checkLoaded();
      },
      error: () => this.checkLoaded()
    });

    this.applicationsService.getApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.checkLoaded();
      },
      error: () => this.checkLoaded()
    });
  }

  private _loadedCount = 0;
  checkLoaded() {
    this._loadedCount++;
    if (this._loadedCount >= 2) this.isLoading = false;
  }

  get activeJobsCount() { return this.jobs.length; }
  get totalApplicationsCount() { return this.applications.length; }
  get pendingApplicationsCount() {
    return this.applications.filter(a => a.status === 'Pending' || a.status === '0').length;
  }

  logout() {
    localStorage.clear();
  }
}
