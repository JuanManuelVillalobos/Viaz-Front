
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
  year?: number;
  sequence?: number;
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
