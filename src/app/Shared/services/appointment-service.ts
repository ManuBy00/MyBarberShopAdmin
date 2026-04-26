import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../entities/appointment';
import { DashboardData } from '../dto/dashboard-data';
import { Service } from '../entities/service';
import { AppointmentDTO } from '../entities/appointmentDTO';



@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/appointments';


  createAppointment(appointmentData: AppointmentDTO): Observable<AppointmentDTO> {
    return this.http.post<AppointmentDTO>(`${this.apiUrl}`, appointmentData);
  }

  updateAppointment(id: number, appointmentData: AppointmentDTO): Observable<AppointmentDTO> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<AppointmentDTO>(url, appointmentData);
}

  getDailyAppointments(date: string): Observable<Appointment[]>{
    const params = new HttpParams().set('date', date);
    return this.http.get<Appointment[]>(`${this.apiUrl}`, { params });
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboardSummary`);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailability(date: string, employeeId: number, excludeId?: number): Observable<string[]> {
  let params = new HttpParams()
    .set('date', date)
    .set('employeeId', employeeId.toString()); 

  // si excludeId existe, lo añadimos a los parámetros
  if (excludeId !== undefined && excludeId !== null) {
    params = params.set('excludeId', excludeId.toString());
  }

  return this.http.get<string[]>(`${this.apiUrl}/availability`, { params });
}

  getServices(): Observable<Service[]>{
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }
}
