import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Appointment } from '../../../../Shared/entities/appointment';
import { AppointmentDTO } from '../../../../Shared/entities/appointmentDTO';
import { AppointmentService } from '../../../../Shared/services/appointment-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../../Shared/entities/employee';
import { EmployeesService } from '../../../../Shared/services/employees-service';   
import { Service } from '../../../../Shared/entities/service';
import { User } from '../../../../Shared/entities/user';
import { UserService } from '../../../../Shared/services/user-service';
import { HtmlParser } from '@angular/compiler';


@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  appointmentService = inject(AppointmentService);
  employeesService = inject(EmployeesService);
  userService = inject(UserService);

  showResults = signal(false);

  close = output<void>();
  saved = output<AppointmentDTO>();


  avaiability = signal<string[]>([]);
  employees = signal<Employee[]>([]);
  services = signal<Service[]>([]);
  users = signal<User[]>([]); 

  appointmentToEdit = input<Appointment | null>(null);

  dataInputs = new FormGroup({
    clientName: new FormControl('', Validators.required),
    clientId: new FormControl(0, Validators.required), 
    phone: new FormControl(''),
    time: new FormControl(''),
    date: new FormControl(''),
    employee: new FormControl(0), 
    service: new FormControl(0)
  });

  isEditMode = computed(() => !!this.appointmentToEdit());
  title = computed(() => this.isEditMode() ? 'Editar Cita' : 'Nueva Cita');


  ngOnInit() {
    if (this.isEditMode()) {
      const appointment = this.appointmentToEdit()!;
      this.dataInputs.patchValue({
        clientName: appointment.customerName,
        clientId: appointment.customerId,
        phone: appointment.telNumber,
        time: appointment.startTime,
        date: appointment.date,
        employee: appointment.employeeId,
        service: appointment.serviceId
      });
    }

    this.loadEmployees();
    this.loadServices();
    this.loadAvailability();
  }

  onClose() {
    this.close.emit();
  }

  onSubmit(): AppointmentDTO {
    const newAppointment: AppointmentDTO = {
    id: this.appointmentToEdit()?.id, 
    clientId:  Number(this.dataInputs.get('clientId')?.value ?? 0),
    date: this.dataInputs.get('date')?.value ?? '',
    startTime: this.dataInputs.get('time')?.value ?? '',
    telNumber: this.dataInputs.get('phone')?.value ?? '',
    employeeId: Number(this.dataInputs.get('employee')?.value), // Aseguramos que sea número
    serviceId: Number(this.dataInputs.get('service')?.value ?? 0) 
  };

    this.saved.emit(newAppointment);
    return newAppointment;
  }

  loadAvailability() {
  const date = this.dataInputs.get('date')?.value;
  const employeeId = Number(this.dataInputs.get('employee')?.value);

  // No disparamos la petición si falta información básica
  if (!date || !employeeId) return;

  // Calculamos el ID a excluir: solo si estamos en modo edición
  const idToExclude = this.isEditMode() ? this.appointmentToEdit()?.id : undefined;

  // DEBUG: Mira esto en la consola del navegador (F12 -> Console)
  console.log('--- DEBUG AVAILABILITY ---');
  console.log('Fecha:', date);
  console.log('Empleado:', employeeId);
  console.log('Modo Edición:', this.isEditMode());
  console.log('ID a excluir:', idToExclude);

  // HACEMOS UNA SOLA LLAMADA (Paso el ID como tercer argumento)
  this.appointmentService.getAvailability(date, employeeId, idToExclude)
    .subscribe(availability => {
      this.avaiability.set(availability);
      console.log('Horas recibidas:', availability); // Para que verifiques en consola
    });
}

  loadEmployees() {
    this.employeesService.getEmployees().subscribe(employees => {
      this.employees.set(employees);
    }); 
  }

  updateAvailability() {
    if (this.dataInputs.get('date')?.value && this.dataInputs.get('employee')?.value) {
      this.loadAvailability();
    }
  
  }

  loadServices() {
    this.appointmentService.getServices().subscribe(services => {
      this.services.set(services);
    });
  }

  searchUsersByName(name: Event) {
    const target = name.target as HTMLInputElement;
    this.userService.searchUsersByName(target.value).subscribe(users => {
      this.users.set(users);
      this.showResults.set(true);
    });
  }

  
  selectUser(client:User) {
    this.dataInputs.patchValue({
      clientName: client.name,
      clientId: client.id,
      phone: client.telNumber 
    });
    this.showResults.set(false); // Cerramos la lista
  }
}