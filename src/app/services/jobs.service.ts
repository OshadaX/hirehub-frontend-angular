import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
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
  private apiUrl = 'http://localhost:5036/api/jobs';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}