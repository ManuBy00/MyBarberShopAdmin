import { ServiceCountDTO } from "./Service-count-dto";

export interface DashboardData {
    employeesNumber: number;
    productsNumber: number;
    serviceCountDTO: ServiceCountDTO[];
}