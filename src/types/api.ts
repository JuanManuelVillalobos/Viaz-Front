// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface Token {
    accessToken: string;
    refreshToken?: string;
}

export interface ViazCurrentUserAuthResponseDTO {
  user: ViazUserDTO;
  effectivePermissions: string[];
}

export interface UserSummaryDTO {
    userId: number;
    username: string;
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



// Role types
export interface Role {
    roleId: number;
    name: string;
    description?: string;
}

export interface RoleCreationRequest {
    name: string;
    description?: string;
}

export interface ShipmentUpdateRequest {
    transportMethod?: string;
    customerServiceAgent?: string;
    typeOfService?: string;
    client?: string;
    origin?: string;
    customsAgent?: string;
    destination?: string;
    status?: string;
    container?: string;
    containerType?: string;
    shipmentDate?: string;
    transport?: string;
    operator?: string;
    terminal?: string;
    ci?: boolean;
    ccp?: boolean;
    taxFolio?: boolean;
    loadManoeuvre?: boolean;
    pisVinculation?: boolean;
    departureDate?: string;
    arrivalDate?: string;
    unloadDate?: string;
    cleaningOrder?: string;
    pod?: string;
    cleaningPatio?: string;
    cleaningDate?: string;
    cleanArrivalDate?: string;
    eir?: string;
    observations?: string;
}

export interface ShipmentIncident {
    shipmentIncidentId: number;
    shipmentId: string;
    incidentType: string;
    comment: string;
    occurredAt: string; // ISO date string
}

export interface ShipmentCharge {
    shipmentChargeId: number;
    shipmentId: string;
    chargeType: string;
    comment: string;
    occurredAt: string; // ISO date string
}

// Pagination types
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// Filter options
export interface ShipmentFilterOptionsDTO {
    statuses: string[];
    clients: string[];
    carriers: string[];
}