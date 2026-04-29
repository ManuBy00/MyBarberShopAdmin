import { Component, inject, signal } from '@angular/core';
import { Card } from '../../../Shared/Components/card/card';
import { AppointmentService } from '../../../Shared/services/appointment-service';
import { Appointment } from '../../../Shared/entities/appointment';
import { AppointmentsCard } from '../../dashboard/components/appointments-card/appointments-card';
import { ServiceCard } from '../../dashboard/components/service-card/service-card';
import { DashboardData } from '../../../Shared/dto/dashboard-data';


@Component({
  selector: 'app-dashboard',
  imports: [Card, AppointmentsCard, ServiceCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  appointmentService = inject(AppointmentService);
  dailyAppointments = signal<Appointment[]>([]);
  dashboardData = signal<DashboardData>({ employeesNumber: 0, productsNumber: 0, serviceCountDTO: [] });

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];

    this.loadDailyAppointments(today);
    this.loadDashboardData();
  }

  
  loadDailyAppointments(date: string) {
    this.appointmentService.getDailyAppointments(date).subscribe(appointments => {
    this.dailyAppointments.set(appointments);
    console.log("Citas diarias cargadas:", appointments);
    });
  }

  loadDashboardData() {
    this.appointmentService.getDashboardData().subscribe(data => {
      this.dashboardData.set(data);
    });
  }

}
