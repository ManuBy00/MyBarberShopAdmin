export interface Appointment {
  id: number;
  date: string;          // Format: "YYYY-MM-DD"
  startTime: string;     // Format: "HH:mm"
  endTime: string;      // Usually calculated by the backend
  status: AppointmentStatus;
  telNumber: string;
  
  // IDs for POST/PUT operations
  customerId: number;
  employeeId: number;
  serviceId: number;

  // fields for UI display (populated via DTO)
  customerName: string;
  employeeName: string;
  serviceName: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';