
import { Calendar, Truck, MapPin, User, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Shipment} from "@/types/shipment.ts";

interface ShipmentDetailFormProps {
  shipment: Shipment;
  isEditing: boolean;
  editedShipment: Shipment;
  handleInputChange: (field: keyof Shipment, value: string|boolean|number) => void;
  getStatusColor: (status: string) => string;
}

export const ShipmentDetailForm = ({
  shipment,
  isEditing,
  editedShipment,
  handleInputChange,
  getStatusColor
}: ShipmentDetailFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Shipment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="transport">Transportation</TabsTrigger>
              <TabsTrigger value="documents">Documents & Dates</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="origin" 
                      value={editedShipment.origin || ''}
                      onChange={(e) => handleInputChange("origin", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="destination" 
                      value={editedShipment.destination || ''}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input 
                    id="client" 
                    value={editedShipment.client || ''}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerServiceAgent">Customer Service Agent</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="customerServiceAgent" 
                      value={editedShipment.customerServiceAgent || ''}
                      onChange={(e) => handleInputChange("customerServiceAgent", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customsAgent">Customs Agent</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="customsAgent" 
                      value={editedShipment.customsAgent || ''}
                      onChange={(e) => handleInputChange("customsAgent", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeOfService">Type of Service</Label>
                  <Select
                    value={editedShipment.typeOfService || ''}
                    onValueChange={(value) => handleInputChange("typeOfService", value)}
                  >
                    <SelectTrigger id="typeOfService">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedShipment.status || ''}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select a status" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transport">Transport Provider</Label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="transport"
                      value={editedShipment.transport || ''}
                      onChange={(e) => handleInputChange("transport", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Shipment Operator</Label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="operator" 
                      value={editedShipment.operator || ''}
                      onChange={(e) => handleInputChange("operator", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="terminal">Shipment Terminal</Label>
                  <Input 
                    id="terminal" 
                    value={editedShipment.terminal || ''}
                    onChange={(e) => handleInputChange("terminal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="container">Container</Label>
                  <Input 
                    id="container" 
                    value={editedShipment.container || ''}
                    onChange={(e) => handleInputChange("container", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="containerType">Container Type</Label>
                  <Input 
                    id="containerType" 
                    value={editedShipment.containerType || ''}
                    onChange={(e) => handleInputChange("containerType", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipmentDate">Container Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="shipmentDate" 
                      type="datetime-local"
                      value={editedShipment.shipmentDate ? editedShipment.shipmentDate.toString().slice(0, 16) : ''}
                      onChange={(e) => handleInputChange("shipmentDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaningOrder">Vacuum Manoeuvre</Label>
                  <Input 
                    id="cleaningOrder" 
                    value={editedShipment.cleaningOrder || ''}
                    onChange={(e) => handleInputChange("cleaningOrder", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pod">Port of Discharge</Label>
                  <Input 
                    id="pod" 
                    value={editedShipment.pod || ''}
                    onChange={(e) => handleInputChange("pod", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Documents & Dates Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Port Departure Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="departureDate" 
                      type="date"
                      value={editedShipment.departureDate || ''}
                      onChange={(e) => handleInputChange("departureDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Port Arrival Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="arrivalDate" 
                      type="datetime-local"
                      value={editedShipment.arrivalDate || ''}
                      onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portUnloadDate">Port Unload Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="portUnloadDate" 
                      type="datetime-local"
                      value={editedShipment.portUnloadDate || ''}
                      onChange={(e) => handleInputChange("portUnloadDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="podDate">Port of Discharge Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="podDate" 
                      type="date"
                      value={editedShipment.podDate || ''}
                      onChange={(e) => handleInputChange("podDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vacuumArrival">Vacuum Arrival</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="vacuumArrival" 
                      type="date"
                      value={editedShipment.vacuumArrival || ''}
                      onChange={(e) => handleInputChange("vacuumArrival", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eir">EIR</Label>
                  <Input 
                    id="eir" 
                    value={editedShipment.eir || ''}
                    onChange={(e) => handleInputChange("eir", e.target.value)}
                  />
                </div>
              </div>
              
              <fieldset className="border rounded-md p-4">
                <legend className="text-sm font-medium px-2">Required Documents</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ci" 
                      checked={editedShipment.ci || false}
                      onCheckedChange={(checked) => handleInputChange("ci", checked)}
                    />
                    <Label htmlFor="ci">CI</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ccp" 
                      checked={editedShipment.ccp || false}
                      onCheckedChange={(checked) => handleInputChange("ccp", checked)}
                    />
                    <Label htmlFor="ccp">CCP</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="taxFolio" 
                      checked={editedShipment.taxFolio || false}
                      onCheckedChange={(checked) => handleInputChange("taxFolio", checked)}
                    />
                    <Label htmlFor="taxFolio">Tax Folio</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="loadManoeuvre" 
                      checked={editedShipment.loadManoeuvre || false}
                      onCheckedChange={(checked) => handleInputChange("loadManoeuvre", checked)}
                    />
                    <Label htmlFor="loadManoeuvre">Load Manoeuvre</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pisVinculation" 
                      checked={editedShipment.pisVinculation || false}
                      onCheckedChange={(checked) => handleInputChange("pisVinculation", checked)}
                    />
                    <Label htmlFor="pisVinculation">PIS Vinculation</Label>
                  </div>
                </div>
              </fieldset>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea 
                  id="observations" 
                  value={editedShipment.observations || ''}
                  onChange={(e) => handleInputChange("observations", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="transport">Transportation</TabsTrigger>
              <TabsTrigger value="documents">Documents & Dates</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab - View Mode */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origin</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.origin || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destination</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.destination || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base">{shipment.client || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Service Agent</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.customerServiceAgent || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customs Agent</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.customsAgent || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type of Service</p>
                  <p className="text-base mt-1 capitalize">
                    {shipment.typeOfService || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge className={getStatusColor(shipment.status || '')}>
                      {shipment.status ? 
                        shipment.status.charAt(0).toUpperCase() + 
                        shipment.status.slice(1) : 
                        'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Transportation Tab - View Mode */}
            <TabsContent value="transport" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transport Provider</p>
                  <div className="flex items-center mt-1">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.transport || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipment Operator</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.operator || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipment Terminal</p>
                  <p className="text-base mt-1">{shipment.terminal || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Container</p>
                  <p className="text-base mt-1">{shipment.container || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Container Type</p>
                  <p className="text-base mt-1">{shipment.containerType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Container Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.shipmentDate ? 
                        new Date(shipment.shipmentDate).toLocaleString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vacuum Manoeuvre</p>
                  <p className="text-base mt-1">{shipment.cleaningOrder || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port of Discharge</p>
                  <p className="text-base mt-1">{shipment.pod || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Documents & Dates Tab - View Mode */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port Departure Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.departureDate ? 
                        new Date(shipment.departureDate).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port Arrival Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.arrivalDate ? 
                        new Date(shipment.arrivalDate).toLocaleString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port Unload Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.portUnloadDate ? 
                        new Date(shipment.portUnloadDate).toLocaleString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port of Discharge Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.podDate ? 
                        new Date(shipment.podDate).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vacuum Arrival</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.vacuumArrival ? 
                        new Date(shipment.vacuumArrival).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">EIR</p>
                  <p className="text-base mt-1">{shipment.eir || 'N/A'}</p>
                </div>
              </div>
              
              <fieldset className="border rounded-md p-4">
                <legend className="text-sm font-medium px-2">Required Documents</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    {shipment.ci ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>CI</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.ccp ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>CCP</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.taxFolio ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>Tax Folio</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.loadManoeuvre ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>Load Manoeuvre</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.pisVinculation ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>PIS Vinculation</span>
                  </div>
                </div>
              </fieldset>
              
              {shipment.observations && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Observations</p>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-base whitespace-pre-wrap">{shipment.observations}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
