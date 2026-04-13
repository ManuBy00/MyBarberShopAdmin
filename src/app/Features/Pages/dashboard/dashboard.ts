import { Component, inject, signal } from '@angular/core';
import { Card } from '../../dashboard/components/card/card';
import { AppointmentService } from '../../../Shared/services/appointment-service';
import { Appointment } from '../../../Shared/entities/appointment';


@Component({
  selector: 'app-dashboard',
  imports: [Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  appointmentService = inject(AppointmentService);
  dailyAppointments = signal<Appointment[]>([]);

  ngOnInit() {
    const today = "2026-05-15"
    this.loadDailyAppointments(today);
  }

  
  loadDailyAppointments(date: string) {
    this.appointmentService.getDailyAppointments(date).subscribe(appointments => {
    this.dailyAppointments.set(appointments);
    console.log("Citas diarias cargadas:", appointments);
    });

    
  }

}
