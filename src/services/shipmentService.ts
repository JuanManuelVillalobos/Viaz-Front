
import { Shipment, ShipmentFile } from "../types/shipment";

// Mock data for shipments
const shipments: Shipment[] = [
  {
    viazId: "VZ-2023-001",
    year: 2023,
    sequence: 1,
    origin: "New York, USA",
    destination: "London, UK",
    client: "Acme Corp",
    shipmentStatus: "delivered",
    transportProvider: "OceanExpress",
    customerServiceAgent: "John Doe",
    customsAgent: "Customs Inc.",
    containerType: "40ft",
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
    viazId: "VZ-2023-002",
    year: 2023,
    sequence: 2,
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    client: "TechGiant Inc",
    shipmentStatus: "in-transit",
    transportProvider: "FastFreight",
    customerServiceAgent: "Jane Smith",
    containerType: "20ft",
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
    viazId: "VZ-2024-001",
    year: 2024,
    sequence: 1,
    origin: "Hamburg, Germany",
    destination: "Singapore",
    client: "Global Traders",
    shipmentStatus: "processing",
    transportProvider: "SeaWays",
    customerServiceAgent: "Michael Brown",
    containerType: "20ft",
    files: []
  },
  {
    viazId: "VZ-2024-002",
    year: 2024,
    sequence: 2,
    origin: "Dubai, UAE",
    destination: "Sydney, Australia",
    client: "Desert Exports",
    shipmentStatus: "delivered",
    transportProvider: "AirCargo",
    customerServiceAgent: "Sarah Johnson",
    containerType: "40ft High Cube",
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
    viazId: "VZ-2024-003",
    year: 2024,
    sequence: 3,
    origin: "Rotterdam, Netherlands",
    destination: "Tokyo, Japan",
    client: "Euro Shipping",
    shipmentStatus: "in-transit",
    transportProvider: "PacificRoute",
    customerServiceAgent: "David Wilson",
    containerType: "20ft",
    files: []
  },
  {
    viazId: "VZ-2024-004",
    year: 2024,
    sequence: 4,
    origin: "Mumbai, India",
    destination: "Cape Town, South Africa",
    client: "Spice Traders",
    shipmentStatus: "delayed",
    transportProvider: "OceanWave",
    customerServiceAgent: "Emily Davis",
    containerType: "40ft",
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
    viazId: "VZ-2024-005",
    year: 2024,
    sequence: 5,
    origin: "São Paulo, Brazil",
    destination: "Mexico City, Mexico",
    client: "Americas United",
    shipmentStatus: "processing",
    transportProvider: "LatinFreight",
    customerServiceAgent: "Carlos Rodriguez",
    containerType: "20ft",
    files: []
  },
];

// Get all shipments
export const getAllShipments = (): Shipment[] => {
  return shipments;
};

// Get a shipment by ID
export const getShipmentById = (id: string): Shipment | undefined => {
  return shipments.find(shipment => shipment.viazId === id);
};

// Update a shipment
export const updateShipment = (updatedShipment: Shipment): Shipment => {
  const index = shipments.findIndex(shipment => shipment.viazId === updatedShipment.viazId);
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
