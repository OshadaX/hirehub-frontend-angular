import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApplicationResponse {
  id: string;
  coverLetter: string;
  status: string;
  appliedAt: string;
  jobTitle: string;
  userName: string;
  userEmail: string;
}

export interface CreateApplicationDto {
  jobId: string;
  userId: string;
  coverLetter: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5036/api/applications';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getApplications(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  createApplication(dto: CreateApplicationDto): Observable<any> {
    return this.http.post(this.apiUrl, dto, {
      headers: this.getHeaders()
    });
  }

  updateStatus(id: string, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, {
      headers: this.getHeaders()
    });
  }
}
