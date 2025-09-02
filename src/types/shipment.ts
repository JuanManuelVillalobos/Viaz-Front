import {UserSummaryDTO} from "@/types/api.ts";

export interface Shipment {
    viazId: string;
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
    files?: number;
}

export interface ShipmentRequest {
    viazId: string;
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

export interface TableColumn {
    id: string;
    label: string;
    visible: boolean;
}

// All available shipment table columns
export const allShipmentColumns: TableColumn[] = [
    {id: "viazId", label: "Referencia", visible: true},
    {id: "client", label: "Cliente", visible: true},
    {id: "origin", label: "Origen", visible: true},
    {id: "destination", label: "Destino", visible: true},
    {id: "status", label: "Estatus", visible: true},
    {id: "shipmentDate", label: "Fecha de Carga", visible: true},
    {id: "transport", label: "Transporte", visible: true},
    {id: "files", label: "Docs", visible: true},
    {id: "transportMethod", label: "Método de Transporte", visible: false},
    {id: "customerServiceAgent", label: "Customer Service", visible: false},
    {id: "typeOfService", label: "Tipo de Servicio", visible: false},
    {id: "customsAgent", label: "Agente Aduanal", visible: false},
    {id: "container", label: "Contenedor", visible: false},
    {id: "containerType", label: "Tipo de Contenedor", visible: false},
    {id: "operator", label: "Operador", visible: false},
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
    {id: "cleaningDate", label: "Fecha de Limpieza", visible: false},
    {id: "cleanArrivalDate", label: "Fecha de Llegada Limpia", visible: false},
    {id: "eir", label: "EIR", visible: false},
    {id: "observations", label: "Observaciones", visible: false},
];

// Default visible columns (subset of allShipmentColumns)
export const defaultShipmentColumns: TableColumn[] = [
    {id: "viazId", label: "Referencia", visible: true},
    {id: "origin", label: "Origen", visible: true},
    {id: "destination", label: "Destino", visible: true},
    {id: "client", label: "Cliente", visible: true},
    {id: "transport", label: "Transporte", visible: true},
    {id: "status", label: "Estatus", visible: true},
    {id: "shipmentDate", label: "Fecha de Carga", visible: true},
    {id: "files", label: "Docs", visible: true},
];

export interface Transport {
    id: string;
    name: string;
}