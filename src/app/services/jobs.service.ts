import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  companyName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://hirehub-api-drgfbjdeeyh8e8e2.indonesiacentral-01.azurewebsites.net/api/jobs';

  getJobs(): Observable<Job[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Job[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}