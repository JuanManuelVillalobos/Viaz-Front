
import { Shipment, ShipmentFile } from "../types/shipment";

// Mock data for shipments
const shipments: Shipment[] = [
  {
    id: "SHP-1001",
    origin: "New York, USA",
    destination: "London, UK",
    customer: "Acme Corp",
    status: "delivered",
    date: "2023-08-01",
    carrier: "OceanExpress",
    files: [
      {
        id: "file-1",
        name: "invoice.pdf",
        type: "application/pdf",
        size: 2048,
        uploadDate: "2023-07-25"
      },
      {
        id: "file-2",
        name: "manifest.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 4096,
        uploadDate: "2023-07-26"
      }
    ]
  },
  {
    id: "SHP-1002",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    customer: "TechGiant Inc",
    status: "in-transit",
    date: "2023-08-05",
    carrier: "FastFreight",
    files: [
      {
        id: "file-3",
        name: "packing-list.pdf",
        type: "application/pdf",
        size: 3072,
        uploadDate: "2023-08-01"
      }
    ]
  },
  {
    id: "SHP-1003",
    origin: "Hamburg, Germany",
    destination: "Singapore",
    customer: "Global Traders",
    status: "processing",
    date: "2023-08-07",
    carrier: "SeaWays",
    files: []
  },
  {
    id: "SHP-1004",
    origin: "Dubai, UAE",
    destination: "Sydney, Australia",
    customer: "Desert Exports",
    status: "delivered",
    date: "2023-07-28",
    carrier: "AirCargo",
    files: [
      {
        id: "file-4",
        name: "customs-declaration.pdf",
        type: "application/pdf",
        size: 1536,
        uploadDate: "2023-07-20"
      }
    ]
  },
  {
    id: "SHP-1005",
    origin: "Rotterdam, Netherlands",
    destination: "Tokyo, Japan",
    customer: "Euro Shipping",
    status: "in-transit",
    date: "2023-08-03",
    carrier: "PacificRoute",
    files: []
  },
  {
    id: "SHP-1006",
    origin: "Mumbai, India",
    destination: "Cape Town, South Africa",
    customer: "Spice Traders",
    status: "delayed",
    date: "2023-08-02",
    carrier: "OceanWave",
    files: [
      {
        id: "file-5",
        name: "bill-of-lading.pdf",
        type: "application/pdf",
        size: 2560,
        uploadDate: "2023-07-29"
      }
    ]
  },
  {
    id: "SHP-1007",
    origin: "São Paulo, Brazil",
    destination: "Mexico City, Mexico",
    customer: "Americas United",
    status: "processing",
    date: "2023-08-08",
    carrier: "LatinFreight",
    files: []
  },
];

// Get all shipments
export const getAllShipments = (): Shipment[] => {
  return shipments;
};

// Get a shipment by ID
export const getShipmentById = (id: string): Shipment | undefined => {
  return shipments.find(shipment => shipment.id === id);
};

// Update a shipment
export const updateShipment = (updatedShipment: Shipment): Shipment => {
  const index = shipments.findIndex(shipment => shipment.id === updatedShipment.id);
  if (index !== -1) {
    shipments[index] = updatedShipment;
  }
  return updatedShipment;
};

// Add a file to a shipment
export const addFileToShipment = (shipmentId: string, file: ShipmentFile): Shipment | undefined => {
  const shipment = getShipmentById(shipmentId);
  if (shipment) {
    if (!shipment.files) {
      shipment.files = [];
    }
    shipment.files.push(file);
    return updateShipment(shipment);
  }
  return undefined;
};

// Remove a file from a shipment
export const removeFileFromShipment = (shipmentId: string, fileId: string): Shipment | undefined => {
  const shipment = getShipmentById(shipmentId);
  if (shipment && shipment.files) {
    shipment.files = shipment.files.filter(file => file.id !== fileId);
    return updateShipment(shipment);
  }
  return undefined;
};

// Get status colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "delivered":
      return "bg-green-500";
    case "in-transit":
      return "bg-blue-500";
    case "processing":
      return "bg-yellow-500";
    case "delayed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
