import {UserSummaryDTO} from "@/types/api.ts";

export interface Shipment {
    baseViazId: string;
    fullViazId: string;
    transportMethod?: string;
    customerServiceAgent?: UserSummaryDTO;
    typeOfService?: string;
    client?: string;
    origin?: string;
    customsAgent?: string;
    destination?: string;
    status?: string;
    container?: string;
    containerType?: string;
    shipmentDate?: string;
    transport?: Transport;
    foreignReference?: string;
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
    hasCleaningAppointment?: boolean;
    cleaningAppointmentDate?: string;
    cleanArrivalDate?: string;
    eir?: string;
    observations?: string;
    open?: boolean;
    hasIncidents?: boolean;
    hasCharges?: boolean;
    hasVariants?: boolean;
    rating?: number;
    customerServiceRating?: number;
    shipmentRating?: number;
    ratingObservation?: string;
}

export interface ShipmentRequest {
    fullViazId: string;
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
    foreignReference?: string;
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
    hasCleaningAppointment?: boolean;
    cleaningAppointmentDate?: string;
    cleanArrivalDate?: string;
    eir?: string;
    observations?: string;
}

export interface TableColumn {
    id: string;
    label: string;
    visible: boolean;
}

// All available shipment table columns
export const allShipmentColumns: TableColumn[] = [
    {id: "fullViazId", label: "Referencia", visible: true},
    {id: "client", label: "Cliente", visible: true},
    {id: "origin", label: "Origen", visible: true},
    {id: "destination", label: "Destino", visible: true},
    {id: "status", label: "Estatus", visible: true},
    {id: "shipmentDate", label: "Fecha de Carga", visible: true},
    {id: "transport", label: "Transporte", visible: true},
    {id: "transportMethod", label: "Método de Transporte", visible: false},
    {id: "customerServiceAgent", label: "Customer Service", visible: false},
    {id: "typeOfService", label: "Tipo de Servicio", visible: false},
    {id: "customsAgent", label: "Agente Aduanal", visible: false},
    {id: "container", label: "Contenedor", visible: false},
    {id: "containerType", label: "Tipo de Contenedor", visible: false},
    {id: "foreignReference", label: "Referencia Externa", visible: false},
    {id: "terminal", label: "Terminal", visible: false},
    {id: "ci", label: "CI", visible: false},
    {id: "ccp", label: "CCP", visible: false},
    {id: "taxFolio", label: "Folio Fiscal", visible: false},
    {id: "loadManoeuvre", label: "Maniobra de Carga", visible: false},
    {id: "pisVinculation", label: "Vinculación PIS", visible: false},
    {id: "departureDate", label: "Fecha de Salida", visible: false},
    {id: "arrivalDate", label: "Fecha de Llegada", visible: false},
    {id: "unloadDate", label: "Fecha de Descarga", visible: false},
    {id: "cleaningOrder", label: "Orden de Limpieza", visible: false},
    {id: "pod", label: "POD", visible: false},
    {id: "cleaningPatio", label: "Patio de Limpieza", visible: false},
    {id: "cleaningAppointmentDate", label: "Fecha de Limpieza", visible: false},
    {id: "cleanArrivalDate", label: "Fecha de Llegada Limpia", visible: false},
    {id: "eir", label: "EIR", visible: false},
    {id: "observations", label: "Observaciones", visible: false},
    {id: "hasIncidents", label: "Incidentes", visible: true},
    {id: "hasCharges", label: "Cargos", visible: true},
];

// Default visible columns (subset of allShipmentColumns)
export const defaultShipmentColumns: TableColumn[] = [
    {id: "fullViazId", label: "Referencia", visible: true},
    {id: "origin", label: "Origen", visible: true},
    {id: "destination", label: "Destino", visible: true},
    {id: "client", label: "Cliente", visible: true},
    {id: "transport", label: "Transporte", visible: true},
    {id: "status", label: "Estatus", visible: true},
    {id: "shipmentDate", label: "Fecha de Carga", visible: true},
    {id: "hasIncidents", label: "Incidentes", visible: true},
    {id: "hasCharges", label: "Cargos", visible: true},
];

export interface Transport {
    id: string;
    name: string;
}

export const SHIPMENT_STATUS_OPTIONS = [
    "Información Pendiente",
    "Folio Pendiente",
    "Maniobras Pendientes",
    "Todo Ok",
    "En Puerto",
    "En Transito",
    "En Destino",
    "POD Pendiente",
    "Vacío Pendiente",
    "Ingresado",
    "Egresado",
];
