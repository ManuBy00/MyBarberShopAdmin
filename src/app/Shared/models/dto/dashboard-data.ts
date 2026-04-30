import { ServiceCountDTO } from "./service-count";

export interface DashboardData {
    employeesNumber: number;
    productsNumber: number;
    serviceCountDTO: ServiceCountDTO[];
}