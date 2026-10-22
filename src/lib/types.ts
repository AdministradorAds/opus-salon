export type BookingStatus =
  | "solicitado"
  | "confirmado"
  | "cancelado"
  | "concluido"
  | "nao_compareceu";

export type ServiceCategoryId =
  | "cabelos"
  | "unhas"
  | "facial"
  | "maquiagem";

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  categoryId: ServiceCategoryId;
  name: string;
  description: string;
  benefits: string[];
  /** Duração em minutos. Null = sob consulta / a configurar no admin */
  durationMinutes: number | null;
  /** Preço em centavos. Null = sob consulta */
  priceCents: number | null;
  requiresConsultation: boolean;
  active: boolean;
  professionalIds: string[];
}

export interface Professional {
  id: string;
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  /** "HH:mm" slots per weekday 0=Dom … 6=Sáb */
  workHours: Record<string, { start: string; end: string } | null>;
  active: boolean;
  /** true = slot genérico "qualquer profissional" */
  isAnyAvailable?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  professionalId: string;
  clientId: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  cancelToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalonSettings {
  name: string;
  tagline: string;
  headline: string;
  subtitle: string;
  address: string;
  addressShort: string;
  phones: string[];
  whatsapp: string;
  instagram: string;
  mapsUrl: string;
  /** Open hours for display */
  hoursLabel: { days: string; hours: string }[];
  /** Default open windows used when professional has no override */
  openHours: Record<string, { start: string; end: string } | null>;
  minAdvanceHours: number;
  maxAdvanceDays: number;
  slotIntervalMinutes: number;
  bufferMinutes: number;
  requireManualConfirmation: boolean;
  cancelPolicy: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

export interface Database {
  version: number;
  settings: SalonSettings;
  categories: ServiceCategory[];
  services: Service[];
  professionals: Professional[];
  clients: Client[];
  bookings: Booking[];
  admins: AdminUser[];
}
