
export interface ShipmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  position?: number; // Added for drag and drop ordering
}

export interface Shipment {
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
}

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
}

// Predefined shipment table columns
export const defaultShipmentColumns: TableColumn[] = [
  { id: "viazId", label: "ID", visible: true },
  { id: "origin", label: "Origin", visible: true },
  { id: "destination", label: "Destination", visible: true },
  { id: "client", label: "Client", visible: true },
  { id: "transportProvider", label: "Transport Provider", visible: true },
  { id: "shipmentStatus", label: "Status", visible: true },
  { id: "files", label: "Files", visible: true },
];
