import {UserSummaryDTO} from "@/types/api.ts";
import {SimplifiedCarrier} from "@/services/api/apiCarrierService.ts";
import {SimplifiedClient} from "@/services/api/apiClientService.ts";

export interface Shipment {
    baseViazId: string;
    fullViazId: string;
    year: number;
    sequence: number;
    transportMethod: string;
    customerServiceAgent: UserSummaryDTO;
    typeOfService: string;
    client: SimplifiedClient;
    origin: string;
    customsAgent: string;
    destination: string;
    status: string;
    container: string;
    containerType: string;
    shipmentDate: string;
    transport: SimplifiedCarrier;
    foreignReference: string;
    terminal: string;
    ci: boolean;
    ccp: boolean;
    taxFolio: boolean;
    loadManoeuvre: boolean;
    pisVinculation: boolean;
    departureDate: string;
    arrivalDate: string;
    unloadDate: string;
    cleaningOrder: string;
    pod: string;
    cleaningPatio: string;
    hasCleaningAppointment: boolean;
    cleaningAppointmentDate: string;
    cleanArrivalDate: string;
    eir: string;
    observations: string;
    files: number;
    open: boolean;
    hasIncidents: boolean;
    hasCharges: boolean;
    carrierRating: number;
    clientRating: number;
    carrierCustomerServiceRating: number;
    clientCustomerServiceRating: number;
    carrierRatingObservation: string;
    clientRatingObservation: string | null;
    shipmentCompleteRating: number;
    hasVariants: boolean;
    hasReschedule: boolean;
    deleted: boolean;
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
    {id: "shipmentDate", label: "Cita de Carga", visible: true},
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
    {id: "cleaningOrder", label: "Maniobra de vacío", visible: false},
    {id: "pod", label: "POD", visible: false},
    {id: "cleaningPatio", label: "Patio de Vacío", visible: false},
    {id: "cleaningAppointmentDate", label: "Fecha de Vacío", visible: false},
    {id: "cleanArrivalDate", label: "Fecha de Llegada Vacío", visible: false},
    {id: "eir", label: "EIR", visible: false},
    {id: "observations", label: "Observaciones", visible: false},
];

// Default visible columns (subset of allShipmentColumns)
export const defaultShipmentColumns: TableColumn[] = [
    {id: "fullViazId", label: "Referencia", visible: true},
    {id: "origin", label: "Origen", visible: true},
    {id: "destination", label: "Destino", visible: true},
    {id: "client", label: "Cliente", visible: true},
    {id: "transport", label: "Transporte", visible: true},
    {id: "status", label: "Estatus", visible: true},
    {id: "shipmentDate", label: "Cita de Carga", visible: true},
];

export const SHIPMENT_STATUS_OPTIONS = [
    "Información Pendiente",
    "Folio Pendiente",
    "Maniobras Pendientes",
    "Todo Ok",
    "En Puerto",
    "En Transito",
    "En Destino",
    "POD Pendiente",
    "Maniobra de Vacío Pendiente",
    "Vacío Pendiente",
    "Ingresado",
    "Egresado",
];

export const SHIPMENT_CONTAINER_OPTIONS = [
    "40_HC",
    "20_HC",
    "40_IMO",
    "20_IMO",
    "40_DC",
    "20_DC",
    "CAJA_53",
    "NISSAN",
    "PLATAFORMA",
    "CAMA_BAJA",
    "RABON",
];

