
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
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ViazUser {
  id?: number;
  email: string;
  password?: string;
}

// Shipment types from our backend
export interface ApiShipment {
  id?: number;
  viazId: string;
  origin: string;
  destination: string;
  customer: string;
  status: string;
  date: string;
  carrier: string;
  files?: ShipmentFile[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentUpdateRequest {
  [key: string]: any;
}
