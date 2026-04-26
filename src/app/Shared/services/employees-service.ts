import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../entities/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/employees';


  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}`);
  }
  
}
