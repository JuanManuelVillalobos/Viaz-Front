import { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Shipment } from "@/types/shipment";
import { getAllShipments, getStatusColor } from "@/services/shipmentService";
import { ScrollArea } from "@/components/ui/scroll-area";

type FilterOption = {
  status: string[];
  carrier: string[];
};

const Shipments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOption>({ status: [], carrier: [] });
  const [newShipmentOpen, setNewShipmentOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    origin: "",
    destination: "",
    customer: "",
    carrier: "",
  });
  const [shipments, setShipments] = useState<Shipment[]>([]);
  
  useEffect(() => {
    setShipments(getAllShipments());
  }, []);
  
  const carriers = [...new Set(shipments.map(shipment => shipment.carrier))];
  const statuses = [...new Set(shipments.map(shipment => shipment.status))];
  
  const handleFilterChange = (type: "status" | "carrier", value: string) => {
    setFilters(prev => {
      const newValues = prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      
      return { ...prev, [type]: newValues };
    });
  };
  
  const resetFilters = () => {
    setFilters({ status: [], carrier: [] });
  };
  
  const handleNewShipmentSubmit = () => {
    if (!newShipment.origin || !newShipment.destination || !newShipment.customer || !newShipment.carrier) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Shipment Created",
      description: `New shipment from ${newShipment.origin} to ${newShipment.destination} has been created.`,
    });
    
    setNewShipment({
      origin: "",
      destination: "",
      customer: "",
      carrier: "",
    });
    setNewShipmentOpen(false);
  };
  
  const filteredShipments = shipments.filter(
    (shipment) => {
      const matchesSearch = 
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(shipment.status);
      const matchesCarrier = filters.carrier.length === 0 || filters.carrier.includes(shipment.carrier);
      
      return matchesSearch && matchesStatus && matchesCarrier;
    }
  );
  
  const handleViewShipment = (id: string) => {
    navigate(`/shipments/${id}`);
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
              <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter {(filters.status.length > 0 || filters.carrier.length > 0) && 
                      <Badge className="ml-1 bg-primary px-1 text-[10px]">
                        {filters.status.length + filters.carrier.length}
                      </Badge>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Shipments</DialogTitle>
                    <DialogDescription>
                      Select filters to narrow down your search
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <Badge 
                            key={status}
                            variant={filters.status.includes(status) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleFilterChange("status", status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Carrier</Label>
                      <div className="flex flex-wrap gap-2">
                        {carriers.map((carrier) => (
                          <Badge 
                            key={carrier}
                            variant={filters.carrier.includes(carrier) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleFilterChange("carrier", carrier)}
                          >
                            {carrier}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={resetFilters}>Reset</Button>
                    <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog open={newShipmentOpen} onOpenChange={setNewShipmentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">+ New Shipment</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new shipment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Input 
                          id="origin" 
                          value={newShipment.origin}
                          onChange={e => setNewShipment({...newShipment, origin: e.target.value})}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input 
                          id="destination" 
                          value={newShipment.destination}
                          onChange={e => setNewShipment({...newShipment, destination: e.target.value})}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Input 
                        id="customer" 
                        value={newShipment.customer}
                        onChange={e => setNewShipment({...newShipment, customer: e.target.value})}
                        placeholder="Customer Name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="carrier">Carrier</Label>
                      <Select 
                        value={newShipment.carrier}
                        onValueChange={(value) => setNewShipment({...newShipment, carrier: value})}
                      >
                        <SelectTrigger id="carrier">
                          <SelectValue placeholder="Select a carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map(carrier => (
                            <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewShipmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNewShipmentSubmit}>Create Shipment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="w-full min-w-[900px]">
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
                      <TableHead>Files</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.length > 0 ? (
                      filteredShipments.map((shipment) => (
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
                            {shipment.files ? shipment.files.length : 0}
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
                                <DropdownMenuItem onClick={() => handleViewShipment(shipment.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Cancel Shipment</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No shipments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
