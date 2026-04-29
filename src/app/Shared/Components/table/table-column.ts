export interface TableColumn {
  label: string;  // Lo que ve el usuario (ej: "Cliente")
  key: string;    // El nombre del campo en el objeto (ej: "customerName")
  type?: string;
}