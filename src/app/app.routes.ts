import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FindJobsComponent } from './components/find-jobs/find-jobs.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { ReviewApplicationComponent } from './components/review-application/review-application.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'find-jobs', component: FindJobsComponent },
  { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'employee-dashboard', component: EmployeeDashboardComponent },
  { path: 'review-application', component: ReviewApplicationComponent },
  { path: 'review-application/:id', component: ReviewApplicationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];