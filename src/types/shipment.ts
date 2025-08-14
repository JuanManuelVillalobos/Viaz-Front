export interface Shipment {
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
    files?: number;
}

export interface TableColumn {
    id: string;
    label: string;
    visible: boolean;
}

// Predefined shipment table columns
export const defaultShipmentColumns: TableColumn[] = [
    {id: "viazId", label: "ID", visible: true},
    {id: "origin", label: "Origin", visible: true},
    {id: "destination", label: "Destination", visible: true},
    {id: "client", label: "Client", visible: true},
    {id: "transport", label: "Transport Provider", visible: true},
    {id: "status", label: "Status", visible: true},
    {id: "files", label: "Files", visible: true},
];

export interface Transport {
    id: string;
    name: string;
}