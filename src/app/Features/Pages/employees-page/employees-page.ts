import { Component, computed, inject, signal } from '@angular/core';
import { Card } from '../../../Shared/Components/card/card';
import { Employee } from '../../../Shared/entities/employee';
import { EmployeesService } from '../../../Shared/services/employees-service';
import { Table } from '../../../Shared/Components/table/table';
import Swal from 'sweetalert2';
import { EmployeeForm } from '../../EmployeeManage/employee-form/employee-form';

@Component({
  selector: 'app-employees-page',
  imports: [Card, Table, EmployeeForm],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.css',
})
export class EmployeesPage {
  employeeService = inject(EmployeesService);

  showModal = signal<boolean>(false)
  selectedEmployee = signal<Employee | null>(null)
  

  employees = signal<Employee[]>([]);
  activeEmployees = computed(() => 
    this.employees().filter(emp => emp.active).length
  );

  inactiveEmployees = computed(() => 
    this.employees().filter(emp => !emp.active).length
  );

  tableColumns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Fecha de alta', key: 'hireDate', type: 'date'},
    { label: 'Estado', key: 'active'}
    
  ];  

  ngOnInit() {
    this.loadEmployees();
  }


  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees.set(data),
      error: (err) => console.error('Error fetching employees:', err)
    });
  }



 deleteEmployee(employee: Employee) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Vas a eliminar a ${employee.name}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar', // Cambiado para que sea claro
    cancelButtonText: 'No, mantener',
    confirmButtonColor: '#f89900',
    cancelButtonColor: '#64748b',
  }).then((result) => {
    if (result.isConfirmed) {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El empleado ha sido eliminado correctamente', 'success');
          this.loadEmployees();
        },
        error: (err) => {
          Swal.fire('Error', 'No se puede eliminar un empleado con citas asignadas. Prueba a cambiar su estado a inactivo.', 'error');
        }
      });
    }
  });
}

openModal(){
  this.selectedEmployee.set(null);
  this.showModal.set(true);
}

closeModal(){
  this.showModal.set(false);
}

openEditModal(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showModal.set(true);
  }

handleSave(employee : Employee) {
    if (this.selectedEmployee()){
      this.updateEmployee(employee)
    }else{
      this.createEmployee(employee)
    }
  }

  updateEmployee(employee: Employee) {
  // Llamamos al servicio pasando el ID (o 0 si por alguna razón no existe) y el objeto
  employee.id = this.selectedEmployee()?.id
  this.employeeService.updateEmployee(this.selectedEmployee()?.id!, employee).subscribe({
    next: (updatedEmp) => {
      // Notificación de éxito
      Swal.fire('Actualizado', 'Empleado modificado con éxito', 'success');
      
      // Recargamos la lista para que la tabla y los contadores (Signals) se actualicen
      this.loadEmployees(); 
      
      // Cerramos el modal si es que el update viene desde el formulario
      this.closeModal();
    },
    error: (err) => {
      // Capturamos el error del backend (como un 404 si no existe o validaciones)
      const msg = err.error || 'No se pudo actualizar la información del empleado';
      Swal.fire('Error', msg, 'error');
    }
  });
}

  createEmployee(newEmployee: Employee){
    this.employeeService.createEmployee(newEmployee).subscribe(() => {
      this.loadEmployees(); // Recargas la tabla
      this.closeModal();    // Cierras el modal
    });
    
  }


  manageAbsences(employee: Employee) {
    // Aquí podrías abrir una sección para gestionar las ausencias del empleado
    console.log('Gestionar ausencias para:', employee);
  }

}
