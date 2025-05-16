
// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  accessToken: string;
  refreshToken?: string;
}

// User types
export interface ViazUserDTO {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING', 
}

export interface ViazUser {
  id?: number;
  email: string;
  password?: string;
}

export interface ViazUserDTO {
  userId: number;
  username: string;
  email: string;
  lastLoginDate?: string;
  status: UserStatus;
  roles: string[];
}

// Shipment file type
export interface ShipmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  position?: number; // Added for drag and drop ordering
}

// Shipment types from our backend
export interface ApiShipment {
  viazId: string;
  typeOfService?: string;
  customerServiceAgent?: string;
  client?: string;
  origin?: string;
  customsAgent?: string;
  destination?: string;
  shipmentStatus?: string;
  container?: string;
  containerType?: string;
  containerDate?: string;
  transportProvider?: string;
  shipmentOperator?: string;
  shipmentTerminal?: string;
  ci?: boolean;
  ccp?: boolean;
  taxFolio?: boolean;
  loadManoeuvre?: boolean;
  pisVinculation?: boolean;
  portDepartureDate?: string;
  portArrivalDate?: string;
  portUnloadDate?: string;
  vacuumManoeuvre?: string;
  portOfDischarge?: string;
  portOfDischargeDate?: string;
  vacuumArrival?: string;
  eir?: string;
  observations?: string;
  files?: ShipmentFile[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentUpdateRequest {
  typeOfService?: string;
  customerServiceAgent?: string;
  client?: string;
  origin?: string;
  customsAgent?: string;
  destination?: string;
  shipmentStatus?: string;
  container?: string;
  containerType?: string;
  containerDate?: string;
  transportProvider?: string;
  shipmentOperator?: string;
  shipmentTerminal?: string;
  ci?: boolean;
  ccp?: boolean;
  taxFolio?: boolean;
  loadManoeuvre?: boolean;
  pisVinculation?: boolean;
  portDepartureDate?: string;
  portArrivalDate?: string;
  portUnloadDate?: string;
  vacuumManoeuvre?: string;
  portOfDischarge?: string;
  portOfDischargeDate?: string;
  vacuumArrival?: string;
  eir?: string;
  observations?: string;
}
