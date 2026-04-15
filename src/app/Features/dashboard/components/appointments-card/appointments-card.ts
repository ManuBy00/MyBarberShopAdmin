import { Component, inject, input, signal } from '@angular/core';
import { AppointmentItem } from '../appointment-item/appointment-item';
import { Appointment } from '../../../../Shared/entities/appointment';
import { AppointmentService } from '../../../../Shared/services/appointment-service';

@Component({
  selector: 'app-appointments-card',
  imports: [AppointmentItem],
  templateUrl: './appointments-card.html',
  styleUrl: './appointments-card.css',
})
export class AppointmentsCard {
  appointmentService = inject(AppointmentService);
  appointmentsList = input<Appointment[]>([]); 

}
