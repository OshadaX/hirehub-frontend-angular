import { Component, inject, OnInit } from '@angular/core';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  imports: [],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  private jobsService = inject(JobsService);

  jobs: any[] = [];
  errorMessage = '';

  ngOnInit() {
    this.jobsService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load jobs.';
        console.error(err);
      }
    });
  }
}