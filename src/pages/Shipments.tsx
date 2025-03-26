
import { useState } from "react";
import { 
  Package, Search, Filter, ArrowUpDown, 
  Download, MoreHorizontal, MapPin 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for shipments
const shipments = [
  {
    id: "SHP-1001",
    origin: "New York, USA",
    destination: "London, UK",
    customer: "Acme Corp",
    status: "delivered",
    date: "2023-08-01",
    carrier: "OceanExpress"
  },
  {
    id: "SHP-1002",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    customer: "TechGiant Inc",
    status: "in-transit",
    date: "2023-08-05",
    carrier: "FastFreight"
  },
  {
    id: "SHP-1003",
    origin: "Hamburg, Germany",
    destination: "Singapore",
    customer: "Global Traders",
    status: "processing",
    date: "2023-08-07",
    carrier: "SeaWays"
  },
  {
    id: "SHP-1004",
    origin: "Dubai, UAE",
    destination: "Sydney, Australia",
    customer: "Desert Exports",
    status: "delivered",
    date: "2023-07-28",
    carrier: "AirCargo"
  },
  {
    id: "SHP-1005",
    origin: "Rotterdam, Netherlands",
    destination: "Tokyo, Japan",
    customer: "Euro Shipping",
    status: "in-transit",
    date: "2023-08-03",
    carrier: "PacificRoute"
  },
  {
    id: "SHP-1006",
    origin: "Mumbai, India",
    destination: "Cape Town, South Africa",
    customer: "Spice Traders",
    status: "delayed",
    date: "2023-08-02",
    carrier: "OceanWave"
  },
  {
    id: "SHP-1007",
    origin: "São Paulo, Brazil",
    destination: "Mexico City, Mexico",
    customer: "Americas United",
    status: "processing",
    date: "2023-08-08",
    carrier: "LatinFreight"
  },
];

const Shipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
        <p className="text-muted-foreground">Manage and track all your shipments</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Shipment List
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">+ New Shipment</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8">
                      ID <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8">
                      Customer <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8">
                      Date <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        {shipment.origin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        {shipment.destination}
                      </div>
                    </TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>{shipment.date}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Cancel Shipment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
