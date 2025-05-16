
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
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Shipment } from "@/types/shipment";
import { getStatusColor } from "@/services/shipmentService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiShipmentService } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterOption = {
  status: string[];
  carrier: string[];
};

const Shipments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOption>({ status: [], carrier: [] });
  const [newShipmentOpen, setNewShipmentOpen] = useState(false);
  const [newShipment, setNewShipment] = useState<Partial<Shipment>>({
    year: new Date().getFullYear(),
    sequence: Math.floor(Math.random() * 1000),
    origin: "",
    destination: "",
    client: "",
    transportProvider: "",
    typeOfService: "",
    customerServiceAgent: "",
    customsAgent: "",
    shipmentStatus: "processing",
    container: "",
    containerType: "",
    shipmentOperator: "",
    shipmentTerminal: "",
    ci: false,
    ccp: false,
    taxFolio: false,
    loadManoeuvre: false,
    pisVinculation: false,
    vacuumManoeuvre: "",
    portOfDischarge: "",
    eir: "",
    observations: ""
  });
  
  // Fetch shipments with React Query
  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: apiShipmentService.getAllShipments,
  });
  
  // Create shipment mutation
  const createShipmentMutation = useMutation({
    mutationFn: apiShipmentService.createShipment,
    onSuccess: () => {
      // Invalidate and refetch shipments query
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setNewShipmentOpen(false);
      
      toast({
        title: "Shipment Created",
        description: `New shipment from ${newShipment.origin} to ${newShipment.destination} has been created.`,
      });
      
      resetNewShipment();
    },
  });
  
  // Reset new shipment form
  const resetNewShipment = () => {
    setNewShipment({
      year: new Date().getFullYear(),
      sequence: Math.floor(Math.random() * 1000),
      origin: "",
      destination: "",
      client: "",
      transportProvider: "",
      typeOfService: "",
      customerServiceAgent: "",
      customsAgent: "",
      shipmentStatus: "processing",
      container: "",
      containerType: "",
      shipmentOperator: "",
      shipmentTerminal: "",
      ci: false,
      ccp: false,
      taxFolio: false,
      loadManoeuvre: false,
      pisVinculation: false,
      vacuumManoeuvre: "",
      portOfDischarge: "",
      eir: "",
      observations: ""
    });
  };
  
  // Delete shipment mutation
  const deleteShipmentMutation = useMutation({
    mutationFn: apiShipmentService.deleteShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      
      toast({
        title: "Shipment Deleted",
        description: "The shipment has been successfully deleted.",
      });
    },
  });
  
  // Extract unique carriers and statuses for filters
  const carriers = [...new Set(shipments.map(shipment => shipment.transportProvider || '').filter(Boolean))];
  const statuses = [...new Set(shipments.map(shipment => shipment.shipmentStatus || '').filter(Boolean))];
  
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
  
  const handleInputChange = (field: keyof Shipment, value: any) => {
    setNewShipment(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNewShipmentSubmit = () => {
    const requiredFields = ['origin', 'destination', 'client', 'transportProvider'];
    const missingFields = requiredFields.filter(field => !newShipment[field as keyof Shipment]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Required fields missing: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Create a new shipment with the API
    createShipmentMutation.mutate(newShipment as any);
  };
  
  const filteredShipments = shipments.filter(
    (shipment) => {
      const matchesSearch = 
        shipment.viazId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filters.status.length === 0 || 
        (shipment.shipmentStatus && filters.status.includes(shipment.shipmentStatus));
      
      const matchesCarrier = 
        filters.carrier.length === 0 || 
        (shipment.transportProvider && filters.carrier.includes(shipment.transportProvider));
      
      return matchesSearch && matchesStatus && matchesCarrier;
    }
  );
  
  const handleViewShipment = (id: string) => {
    navigate(`/shipments/${id}`);
  };
  
  const handleDeleteShipment = (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      deleteShipmentMutation.mutate(id);
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">Loading shipments...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-red-500">Error loading shipments. Please try again later.</p>
        </div>
      </div>
    );
  }

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
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new shipment
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="transport">Transportation</TabsTrigger>
                      <TabsTrigger value="documents">Documents & Dates</TabsTrigger>
                    </TabsList>
                    
                    {/* Basic Info Tab */}
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Input 
                            id="year" 
                            type="number"
                            value={newShipment.year}
                            onChange={e => handleInputChange("year", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sequence">Sequence</Label>
                          <Input 
                            id="sequence" 
                            type="number"
                            value={newShipment.sequence}
                            onChange={e => handleInputChange("sequence", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origin*</Label>
                          <Input 
                            id="origin" 
                            value={newShipment.origin}
                            onChange={e => handleInputChange("origin", e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destination*</Label>
                          <Input 
                            id="destination" 
                            value={newShipment.destination}
                            onChange={e => handleInputChange("destination", e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="client">Client*</Label>
                        <Input 
                          id="client" 
                          value={newShipment.client}
                          onChange={e => handleInputChange("client", e.target.value)}
                          placeholder="Client Name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerServiceAgent">Customer Service Agent</Label>
                          <Input 
                            id="customerServiceAgent" 
                            value={newShipment.customerServiceAgent}
                            onChange={e => handleInputChange("customerServiceAgent", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customsAgent">Customs Agent</Label>
                          <Input 
                            id="customsAgent" 
                            value={newShipment.customsAgent}
                            onChange={e => handleInputChange("customsAgent", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="typeOfService">Type of Service</Label>
                          <Select
                            value={newShipment.typeOfService}
                            onValueChange={value => handleInputChange("typeOfService", value)}
                          >
                            <SelectTrigger id="typeOfService">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="priority">Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipmentStatus">Status</Label>
                          <Select
                            value={newShipment.shipmentStatus}
                            onValueChange={value => handleInputChange("shipmentStatus", value)}
                          >
                            <SelectTrigger id="shipmentStatus">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="delayed">Delayed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Transportation Tab */}
                    <TabsContent value="transport" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transportProvider">Transport Provider*</Label>
                          <Input 
                            id="transportProvider" 
                            value={newShipment.transportProvider}
                            onChange={e => handleInputChange("transportProvider", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="shipmentOperator">Shipment Operator</Label>
                          <Input 
                            id="shipmentOperator" 
                            value={newShipment.shipmentOperator}
                            onChange={e => handleInputChange("shipmentOperator", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shipmentTerminal">Shipment Terminal</Label>
                          <Input 
                            id="shipmentTerminal" 
                            value={newShipment.shipmentTerminal}
                            onChange={e => handleInputChange("shipmentTerminal", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vacuumManoeuvre">Vacuum Manoeuvre</Label>
                          <Input 
                            id="vacuumManoeuvre" 
                            value={newShipment.vacuumManoeuvre}
                            onChange={e => handleInputChange("vacuumManoeuvre", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="container">Container</Label>
                          <Input 
                            id="container" 
                            value={newShipment.container}
                            onChange={e => handleInputChange("container", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="containerType">Container Type</Label>
                          <Input 
                            id="containerType" 
                            value={newShipment.containerType}
                            onChange={e => handleInputChange("containerType", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="containerDate">Container Date</Label>
                          <Input 
                            id="containerDate" 
                            type="datetime-local"
                            value={newShipment.containerDate}
                            onChange={e => handleInputChange("containerDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                          <Input 
                            id="portOfDischarge" 
                            value={newShipment.portOfDischarge}
                            onChange={e => handleInputChange("portOfDischarge", e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Documents & Dates Tab */}
                    <TabsContent value="documents" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="portDepartureDate">Port Departure Date</Label>
                          <Input 
                            id="portDepartureDate" 
                            type="date"
                            value={newShipment.portDepartureDate}
                            onChange={e => handleInputChange("portDepartureDate", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="portArrivalDate">Port Arrival Date</Label>
                          <Input 
                            id="portArrivalDate" 
                            type="datetime-local"
                            value={newShipment.portArrivalDate}
                            onChange={e => handleInputChange("portArrivalDate", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="portUnloadDate">Port Unload Date</Label>
                          <Input 
                            id="portUnloadDate" 
                            type="datetime-local"
                            value={newShipment.portUnloadDate}
                            onChange={e => handleInputChange("portUnloadDate", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="portOfDischargeDate">Port of Discharge Date</Label>
                          <Input 
                            id="portOfDischargeDate" 
                            type="date"
                            value={newShipment.portOfDischargeDate}
                            onChange={e => handleInputChange("portOfDischargeDate", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vacuumArrival">Vacuum Arrival</Label>
                          <Input 
                            id="vacuumArrival" 
                            type="date"
                            value={newShipment.vacuumArrival}
                            onChange={e => handleInputChange("vacuumArrival", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="eir">EIR</Label>
                          <Input 
                            id="eir" 
                            value={newShipment.eir}
                            onChange={e => handleInputChange("eir", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <fieldset className="border rounded-md p-4">
                        <legend className="text-sm font-medium px-2">Required Documents</legend>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="ci" 
                              checked={newShipment.ci}
                              onCheckedChange={checked => handleInputChange("ci", checked)}
                            />
                            <Label htmlFor="ci">CI</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="ccp" 
                              checked={newShipment.ccp}
                              onCheckedChange={checked => handleInputChange("ccp", checked)}
                            />
                            <Label htmlFor="ccp">CCP</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="taxFolio" 
                              checked={newShipment.taxFolio}
                              onCheckedChange={checked => handleInputChange("taxFolio", checked)}
                            />
                            <Label htmlFor="taxFolio">Tax Folio</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="loadManoeuvre" 
                              checked={newShipment.loadManoeuvre}
                              onCheckedChange={checked => handleInputChange("loadManoeuvre", checked)}
                            />
                            <Label htmlFor="loadManoeuvre">Load Manoeuvre</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="pisVinculation" 
                              checked={newShipment.pisVinculation}
                              onCheckedChange={checked => handleInputChange("pisVinculation", checked)}
                            />
                            <Label htmlFor="pisVinculation">PIS Vinculation</Label>
                          </div>
                        </div>
                      </fieldset>
                      
                      <div className="space-y-2">
                        <Label htmlFor="observations">Observations</Label>
                        <Textarea 
                          id="observations" 
                          value={newShipment.observations}
                          onChange={e => handleInputChange("observations", e.target.value)}
                          placeholder="Add any additional notes here..."
                          rows={3}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        resetNewShipment();
                        setNewShipmentOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleNewShipmentSubmit}
                      disabled={createShipmentMutation.isPending}
                    >
                      {createShipmentMutation.isPending ? "Creating..." : "Create Shipment"}
                    </Button>
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
                          Client <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="p-0 h-8">
                          Year <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Transport Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.length > 0 ? (
                      filteredShipments.map((shipment) => (
                        <TableRow key={shipment.viazId}>
                          <TableCell className="font-medium">{shipment.viazId}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                              {shipment.origin || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                              {shipment.destination || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>{shipment.client || "N/A"}</TableCell>
                          <TableCell>{shipment.year}</TableCell>
                          <TableCell>{shipment.transportProvider || "N/A"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(shipment.shipmentStatus || "")}>
                              {(shipment.shipmentStatus || "").charAt(0).toUpperCase() + (shipment.shipmentStatus || "").slice(1) || "N/A"}
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
                                <DropdownMenuItem onClick={() => handleViewShipment(shipment.viazId)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-500"
                                  onClick={() => handleDeleteShipment(shipment.viazId)}
                                  disabled={deleteShipmentMutation.isPending}
                                >
                                  {deleteShipmentMutation.isPending && deleteShipmentMutation.variables === shipment.viazId 
                                    ? "Deleting..." 
                                    : "Delete Shipment"
                                  }
                                </DropdownMenuItem>
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
