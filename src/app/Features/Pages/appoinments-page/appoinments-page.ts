import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-appoinments-page',
  imports: [],
  templateUrl: './appoinments-page.html',
  styleUrl: './appoinments-page.css',
})
export class AppoinmentsPage {
  appointments = signal<any[]>([]);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  // Esto genera el texto "miércoles, 15 de abril de 2026" automáticamente
  dateLabel = computed(() => {
    return new Date(this.selectedDate()).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  setToday() {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
  }

  onDateChange(event: any) {
    this.selectedDate.set(event.target.value);
    // Aquí llamarías a tu servicio para recargar las citas de esa fecha
  }

  onSearch(event: Event) {
    // Aquí llamarías a tu servicio para buscar citas por el término ingresado
  }
}
