
export interface ShipmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  position?: number; // Added for drag and drop ordering
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  status: string;
  date: string;
  carrier: string;
  files?: ShipmentFile[];
}
