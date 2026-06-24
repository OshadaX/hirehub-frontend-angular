import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { JobsComponent } from './components/jobs/jobs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'jobs', component: JobsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];