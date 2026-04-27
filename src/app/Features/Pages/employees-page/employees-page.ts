import { Component, computed, inject, signal } from '@angular/core';
import { Card } from '../../dashboard/components/card/card';
import { Employee } from '../../../Shared/entities/employee';
import { EmployeesService } from '../../../Shared/services/employees-service';

@Component({
  selector: 'app-employees-page',
  imports: [Card],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.css',
})
export class EmployeesPage {
  employeeService = inject(EmployeesService);

  employees = signal<Employee[]>([]);
  activeEmployees = computed(() => 
    this.employees().filter(emp => emp.active).length
  );

  inactiveEmployees = computed(() => 
    this.employees().filter(emp => !emp.active).length
  );

  ngOnInit() {
    this.loadEmployees();
  }



  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees.set(data),
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

}
