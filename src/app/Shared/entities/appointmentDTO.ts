export interface AppointmentDTO {
  id?: number; // Opcional para creación, requerido para edición
  date: string;          // Format: "YYYY-MM-DD"
  startTime: string;     // Format: "HH:mm"
  telNumber: string;
  clientId: number;
  employeeId: number;
  serviceId: number;
}
