import { Component, inject, input } from '@angular/core';
import { DashboardPage } from '../../../Pages/dashboard/dashboard-page';
import { ServiceCountDTO } from '../../../../Shared/dto/Service-count-dto';

@Component({
  selector: 'app-service-card',
  imports: [],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard {
  serviceList = input<ServiceCountDTO[]>([]);

  ngOnInit() {
    console.log("Service list en ServiceCard:", this.serviceList());
  }
}
