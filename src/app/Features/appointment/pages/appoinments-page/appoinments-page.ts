import { Component, computed, inject, signal } from '@angular/core';
import { AppointmentService } from '../../appointment-service';
import { Appointment } from '../../../../shared/models/entities/appointment';
import Swal from 'sweetalert2';
import { AppointmentForm } from '../../components/appointment-form/appointment-form';
import { AppointmentRequest } from '../../../../shared/models/dto/appointment-request';
import { EmployeesService } from '../../../employees/employees-service';
import { Employee } from '../../../../shared/models/entities/employee';
import { Table } from '../../../../shared/Components/table/table';


@Component({
  selector: 'app-appoinments-page',
  imports: [AppointmentForm, Table],
  templateUrl: './appoinments-page.html',
  styleUrl: './appoinments-page.css',
})
export class AppoinmentsPage {
  appointmentService = inject(AppointmentService); 
  employeesService = inject(EmployeesService);

  appointments = signal<Appointment[]>([]);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  showModal = signal(false);
  employees = signal<Employee[]>([]);
  selectedAppointment = signal<Appointment | null>(null);

  //columnas de la tabla
  tableColumns = [
    { label: 'Cliente', key: 'customerName' },
    { label: 'Teléfono', key: 'telNumber' },
    { label: 'Empleado', key: 'employeeName' },
    { label: 'Servicio', key: 'serviceName' },
    { label: 'Fecha', key: 'date', type: 'date'},
    { label: 'Hora', key: 'startTime' },
    { label: 'Estado', key: 'status' },

  ]

  // Nuevo estado para el filtro de empleado
  filterEmployeeId = signal<string>("all");
  // Computed para filtrar las citas según el empleado seleccionado
  filteredAppointments = computed(() => {
  const appointments = this.appointments();
  const filter = this.filterEmployeeId();

  if (filter === "all") return appointments;
  
  return appointments.filter(app => app.employeeId === Number(filter));
});

  
  dateLabel = computed(() => {
    return new Date(this.selectedDate()).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  ngOnInit() {
    this.loadEmployees();
    this.onDateChange({ target: { value: this.selectedDate() } }); 
  }


  loadEmployees() {
    this.employeesService.getEmployees().subscribe(employees => {
      this.employees.set(employees);
    }); 
  }



  setToday() {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
    this.onDateChange({ target: { value: this.selectedDate() } }); // Simula un cambio de fecha para cargar las citas de hoy
  }

  onDateChange(event: any) {
    this.selectedDate.set(event.target.value);
    this.appointmentService.getDailyAppointments(this.selectedDate()).subscribe(appointments => {
      this.appointments.set(appointments);
    });
  }


  onSearch(event: Event) {
    
  }

  onCancel(appointment: Appointment) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#f89900',
      cancelButtonColor: '#64748b',

    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(appointment.id).subscribe(() => {
          Swal.fire('Eliminada', 'La cita ha sido eliminada', 'success');
          // Actualiza la lista de citas después de cancelar
          this.onDateChange({ target: { value: this.selectedDate() } });
        }, error => {
          Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
        });
      }
    });
  }

  openCreateModal() {
    this.selectedAppointment.set(null);
    this.showModal.set(true);
  }

  openEditModal(appointment: Appointment) {
    this.selectedAppointment.set(appointment);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  handleSave(appointment: AppointmentRequest) {
    if (this.selectedAppointment()) {
      this.updateAppointment(appointment);
      this.onDateChange({ target: { value: this.selectedDate() } }); // Recarga las citas para mostrar la actualización
    } else {
      this.saveNewAppointment(appointment);
    }
  }

  employeeFilter(employeeId: string) {
  this.filterEmployeeId.set(employeeId);
}

saveNewAppointment(appointment: AppointmentRequest) {
   this.appointmentService.createAppointment(appointment).subscribe(() => {
      Swal.fire('Creada', 'La cita ha sido creada exitosamente', 'success');
      this.onDateChange({ target: { value: this.selectedDate() } }); // Recarga las citas para mostrar la nueva
    }, error => {
      Swal.fire('Error', 'No se pudo crear la cita', 'error');
    });
    this.closeModal(); // Cierra el modal después de guardar

}

updateAppointment(appointment: AppointmentRequest) {
  this.appointmentService.updateAppointment(appointment.id ?? 0, appointment).subscribe({
      next: (updatedApp) => {
        Swal.fire('Actualizada', 'Cita modificada con éxito', 'success');
        this.onDateChange({ target: { value: this.selectedDate() } }); // Recargamos la lista
      },
      error: (err) => {
        // Aquí capturas el 409 Conflict o el 404
        const msg = err.error || 'No se pudo actualizar la cita';
        Swal.fire('Error', msg, 'error');
      }
    });
}


 
  
}
