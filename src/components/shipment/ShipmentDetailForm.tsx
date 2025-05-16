
import { useState } from "react";
import { Calendar, Truck, MapPin, User, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ApiShipment } from "@/types/api";

interface ShipmentDetailFormProps {
  shipment: ApiShipment;
  isEditing: boolean;
  editedShipment: ApiShipment;
  handleInputChange: (field: keyof ApiShipment, value: any) => void;
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
                  <Label htmlFor="shipmentStatus">Status</Label>
                  <Select
                    value={editedShipment.shipmentStatus || ''}
                    onValueChange={(value) => handleInputChange("shipmentStatus", value)}
                  >
                    <SelectTrigger id="shipmentStatus">
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
                  <Label htmlFor="transportProvider">Transport Provider</Label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="transportProvider" 
                      value={editedShipment.transportProvider || ''}
                      onChange={(e) => handleInputChange("transportProvider", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipmentOperator">Shipment Operator</Label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="shipmentOperator" 
                      value={editedShipment.shipmentOperator || ''}
                      onChange={(e) => handleInputChange("shipmentOperator", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentTerminal">Shipment Terminal</Label>
                  <Input 
                    id="shipmentTerminal" 
                    value={editedShipment.shipmentTerminal || ''}
                    onChange={(e) => handleInputChange("shipmentTerminal", e.target.value)}
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
                  <Label htmlFor="containerDate">Container Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="containerDate" 
                      type="datetime-local"
                      value={editedShipment.containerDate ? editedShipment.containerDate.toString().slice(0, 16) : ''}
                      onChange={(e) => handleInputChange("containerDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vacuumManoeuvre">Vacuum Manoeuvre</Label>
                  <Input 
                    id="vacuumManoeuvre" 
                    value={editedShipment.vacuumManoeuvre || ''}
                    onChange={(e) => handleInputChange("vacuumManoeuvre", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portOfDischarge">Port of Discharge</Label>
                  <Input 
                    id="portOfDischarge" 
                    value={editedShipment.portOfDischarge || ''}
                    onChange={(e) => handleInputChange("portOfDischarge", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Documents & Dates Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portDepartureDate">Port Departure Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="portDepartureDate" 
                      type="date"
                      value={editedShipment.portDepartureDate || ''}
                      onChange={(e) => handleInputChange("portDepartureDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portArrivalDate">Port Arrival Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="portArrivalDate" 
                      type="datetime-local"
                      value={editedShipment.portArrivalDate || ''}
                      onChange={(e) => handleInputChange("portArrivalDate", e.target.value)}
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
                  <Label htmlFor="portOfDischargeDate">Port of Discharge Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="portOfDischargeDate" 
                      type="date"
                      value={editedShipment.portOfDischargeDate || ''}
                      onChange={(e) => handleInputChange("portOfDischargeDate", e.target.value)}
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
                    <Badge className={getStatusColor(shipment.shipmentStatus || '')}>
                      {shipment.shipmentStatus ? 
                        shipment.shipmentStatus.charAt(0).toUpperCase() + 
                        shipment.shipmentStatus.slice(1) : 
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
                    <p className="text-base">{shipment.transportProvider || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipment Operator</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.shipmentOperator || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipment Terminal</p>
                  <p className="text-base mt-1">{shipment.shipmentTerminal || 'N/A'}</p>
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
                      {shipment.containerDate ? 
                        new Date(shipment.containerDate).toLocaleString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vacuum Manoeuvre</p>
                  <p className="text-base mt-1">{shipment.vacuumManoeuvre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port of Discharge</p>
                  <p className="text-base mt-1">{shipment.portOfDischarge || 'N/A'}</p>
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
                      {shipment.portDepartureDate ? 
                        new Date(shipment.portDepartureDate).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Port Arrival Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.portArrivalDate ? 
                        new Date(shipment.portArrivalDate).toLocaleString() : 
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
                      {shipment.portOfDischargeDate ? 
                        new Date(shipment.portOfDischargeDate).toLocaleDateString() : 
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
