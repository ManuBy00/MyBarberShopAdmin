import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../entities/appointment';



@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/appointments';

  getDailyAppointments(date: string): Observable<Appointment[]>{
    const params = new HttpParams().set('date', date);
    return this.http.get<Appointment[]>(`${this.apiUrl}/search/daily`, { params });
  }

  
}
