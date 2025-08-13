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
          Detalles del Embarque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-4">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">Básico</TabsTrigger>
              <TabsTrigger value="transport" className="text-xs sm:text-sm">Transporte</TabsTrigger>
              <TabsTrigger value="contenedor" className="text-xs sm:text-sm">Contenedor</TabsTrigger>
              <TabsTrigger value="vacio" className="text-xs sm:text-sm">Vacío</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Docs</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen*</Label>
                  <Input
                    id="origin"
                    value={editedShipment.origin || ''}
                    onChange={e => handleInputChange("origin", e.target.value)}
                    placeholder="Ciudad, País"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino*</Label>
                  <Input
                    id="destination"
                    value={editedShipment.destination || ''}
                    onChange={e => handleInputChange("destination", e.target.value)}
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente*</Label>
                  <Input
                    id="client"
                    value={editedShipment.client || ''}
                    onChange={e => handleInputChange("client", e.target.value)}
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportMethod">T/M</Label>
                  <Select
                    value={editedShipment.transportMethod || ''}
                    onValueChange={value => handleInputChange("transportMethod", value)}
                  >
                    <SelectTrigger id="transportMethod">
                      <SelectValue placeholder="Selecciona tipo de transporte"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terreste">Terrestre</SelectItem>
                      <SelectItem value="maritimo">Marítimo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerServiceAgent">Customer Service</Label>
                  <Input
                    id="customerServiceAgent"
                    value={editedShipment.customerServiceAgent || ''}
                    onChange={e => handleInputChange("customerServiceAgent", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customsAgent">Agente Aduanal</Label>
                  <Input
                    id="customsAgent"
                    value={editedShipment.customsAgent || ''}
                    onChange={e => handleInputChange("customsAgent", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeOfService">Tipo de Servicio</Label>
                  <Select
                    value={editedShipment.typeOfService || ''}
                    onValueChange={value => handleInputChange("typeOfService", value)}
                  >
                    <SelectTrigger id="typeOfService">
                      <SelectValue placeholder="Selecciona tipo de servicio"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="sencillo">Sencillo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estatus</Label>
                  <Select
                    value={editedShipment.status || ''}
                    onValueChange={value => handleInputChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_information">Información Pendiente</SelectItem>
                      <SelectItem value="pending_folio">Folio Pendiente</SelectItem>
                      <SelectItem value="pending_manouvres">Maniobras Pendiente</SelectItem>
                      <SelectItem value="everything_Ok">Todo Ok</SelectItem>
                      <SelectItem value="in_port">En Puerto</SelectItem>
                      <SelectItem value="in_transit">En Transito</SelectItem>
                      <SelectItem value="in_destination">En Destino</SelectItem>
                      <SelectItem value="pending_POD">POD Pendiente</SelectItem>
                      <SelectItem value="pending_vacuum_manouvre">Maniobra de Vacío Pendiente</SelectItem>
                      <SelectItem value="recieved">Ingresado</SelectItem>
                      <SelectItem value="released">Egresado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Transportation Tab */}
            <TabsContent value="transport" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transport">Transporte*</Label>
                  <Input
                    id="transport"
                    value={editedShipment.transport || ''}
                    onChange={e => handleInputChange("transport", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Operador o Referencia</Label>
                  <Input
                    id="operator"
                    value={editedShipment.operator || ''}
                    onChange={e => handleInputChange("operator", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="terminal">Terminal</Label>
                  <Input
                    id="terminal"
                    value={editedShipment.terminal || ''}
                    onChange={e => handleInputChange("terminal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pod">POD</Label>
                  <Select
                    value={editedShipment.pod || ''}
                    onValueChange={value => handleInputChange("pod", value)}
                  >
                    <SelectTrigger id="pod">
                      <SelectValue placeholder="Selecciona el estatus del POD"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Container Tab */}
            <TabsContent value="contenedor" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="container">Número de Contenedor</Label>
                  <Input
                    id="container"
                    value={editedShipment.container || ''}
                    onChange={e => handleInputChange("container", e.target.value)}
                    placeholder="Ingrese número de contenedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="containerType">Tipo de Contenedor</Label>
                  <Select
                    value={editedShipment.containerType || ''}
                    onValueChange={value => handleInputChange("containerType", value)}
                  >
                    <SelectTrigger id="containerType">
                      <SelectValue placeholder="Selecciona el tipo de contenedor"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40_HC">40 HC</SelectItem>
                      <SelectItem value="20_HC">20 HC</SelectItem>
                      <SelectItem value="40_IMO">40 IMO</SelectItem>
                      <SelectItem value="20_IMO">20 IMO</SelectItem>
                      <SelectItem value="40_DC">40 DC</SelectItem>
                      <SelectItem value="20_DC">20 DC</SelectItem>
                      <SelectItem value="CAJA_53">Caja 53</SelectItem>
                      <SelectItem value="NISSAN">NISSAN</SelectItem>
                      <SelectItem value="PLATAFORMA">PLATAFORMA</SelectItem>
                      <SelectItem value="CAMA_BAJA">CAMA BAJA</SelectItem>
                      <SelectItem value="RABON">RABON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentDate">Fecha de Contenedor</Label>
                  <Input
                    id="shipmentDate"
                    type="datetime-local"
                    value={editedShipment.shipmentDate || ''}
                    onChange={e => handleInputChange("shipmentDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminal">Terminal</Label>
                  <Input
                    id="terminal"
                    value={editedShipment.terminal || ''}
                    onChange={e => handleInputChange("terminal", e.target.value)}
                    placeholder="Ingrese terminal"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Vacuum Tab */}
            <TabsContent value="vacio" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaningOrder">Maniobra de Vacío</Label>
                  <Select
                    value={editedShipment.cleaningOrder || ''}
                    onValueChange={value => handleInputChange("cleaningOrder", value)}
                  >
                    <SelectTrigger id="cleaningOrder">
                      <SelectValue placeholder="Selecciona estatus"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solicited">Solicitada</SelectItem>
                      <SelectItem value="sent">Enviada</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleaningDate">Fecha de Vacío</Label>
                  <Input
                    id="cleaningDate"
                    type="date"
                    value={editedShipment.cleaningDate || ''}
                    onChange={e => handleInputChange("cleaningDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaningPatio">Patio</Label>
                  <Select
                    value={editedShipment.cleaningPatio || ''}
                    onValueChange={value => handleInputChange("cleaningPatio", value)}
                  >
                    <SelectTrigger id="cleaningPatio">
                      <SelectValue placeholder="Selecciona el patio"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssa">SSA</SelectItem>
                      <SelectItem value="timsa">TIMSA</SelectItem>
                      <SelectItem value="cima">CIMA</SelectItem>
                      <SelectItem value="ocupa">OCUPA</SelectItem>
                      <SelectItem value="isl">ISL</SelectItem>
                      <SelectItem value="cise">CISE</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleanArrivalDate">Entrega de Vacío</Label>
                  <Input
                    id="cleanArrivalDate"
                    type="date"
                    value={editedShipment.cleanArrivalDate || ''}
                    onChange={e => handleInputChange("cleanArrivalDate", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Documents & Dates Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Fecha Salida de Puerto</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={editedShipment.departureDate || ''}
                    onChange={e => handleInputChange("departureDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Fecha Llegada a Puerto</Label>
                  <Input
                    id="arrivalDate"
                    type="datetime-local"
                    value={editedShipment.arrivalDate || ''}
                    onChange={e => handleInputChange("arrivalDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unloadDate">Fecha Descarga</Label>
                  <Input
                    id="unloadDate"
                    type="datetime-local"
                    value={editedShipment.unloadDate || ''}
                    onChange={e => handleInputChange("unloadDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eir">EIR</Label>
                  <Select
                    value={editedShipment.eir || ''}
                    onValueChange={value => handleInputChange("eir", value)}
                  >
                    <SelectTrigger id="eir">
                      <SelectValue placeholder="Selecciona el EIR"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">No dieron</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <fieldset className="border rounded-md p-4">
                <legend className="text-sm font-medium px-2">Documentos</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ci"
                      checked={editedShipment.ci || false}
                      onCheckedChange={checked => handleInputChange("ci", checked)}
                    />
                    <Label htmlFor="ci">CI</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ccp"
                      checked={editedShipment.ccp || false}
                      onCheckedChange={checked => handleInputChange("ccp", checked)}
                    />
                    <Label htmlFor="ccp">CCP</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taxFolio"
                      checked={editedShipment.taxFolio || false}
                      onCheckedChange={checked => handleInputChange("taxFolio", checked)}
                    />
                    <Label htmlFor="taxFolio">Folio Fiscal</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="loadManoeuvre"
                      checked={editedShipment.loadManoeuvre || false}
                      onCheckedChange={checked => handleInputChange("loadManoeuvre", checked)}
                    />
                    <Label htmlFor="loadManoeuvre">Maniobra de Carga</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pisVinculation"
                      checked={editedShipment.pisVinculation || false}
                      onCheckedChange={checked => handleInputChange("pisVinculation", checked)}
                    />
                    <Label htmlFor="pisVinculation">Vinculacion PIS</Label>
                  </div>
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={editedShipment.observations || ''}
                  onChange={e => handleInputChange("observations", e.target.value)}
                  placeholder="Add any additional notes here..."
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-4">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">Básico</TabsTrigger>
              <TabsTrigger value="transport" className="text-xs sm:text-sm">Transporte</TabsTrigger>
              <TabsTrigger value="contenedor" className="text-xs sm:text-sm">Contenedor</TabsTrigger>
              <TabsTrigger value="vacio" className="text-xs sm:text-sm">Vacío</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Docs</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab - View Mode */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origen</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.origin || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destino</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.destination || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.client || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">T/M</p>
                  <p className="text-base mt-1 capitalize">
                    {shipment.transportMethod || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Service</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.customerServiceAgent || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agente Aduanal</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.customsAgent || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Servicio</p>
                  <p className="text-base mt-1 capitalize">
                    {shipment.typeOfService || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estatus</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transporte</p>
                  <div className="flex items-center mt-1">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.transport || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operador o Referencia</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.operator || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminal</p>
                  <p className="text-base mt-1">{shipment.terminal || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">POD</p>
                  <p className="text-base mt-1">{shipment.pod || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>

            {/* Container Tab - View Mode */}
            <TabsContent value="contenedor" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número de Contenedor</p>
                  <p className="text-base mt-1">{shipment.container || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Contenedor</p>
                  <p className="text-base mt-1">{shipment.containerType || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Contenedor</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.shipmentDate ? 
                        new Date(shipment.shipmentDate).toLocaleString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminal</p>
                  <p className="text-base mt-1">{shipment.terminal || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>

            {/* Vacuum Tab - View Mode */}
            <TabsContent value="vacio" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maniobra de Vacío</p>
                  <p className="text-base mt-1">{shipment.cleaningOrder || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Vacío</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.cleaningDate ? 
                        new Date(shipment.cleaningDate).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patio</p>
                  <p className="text-base mt-1">{shipment.cleaningPatio || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entrega de Vacío</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.cleanArrivalDate ? 
                        new Date(shipment.cleanArrivalDate).toLocaleDateString() : 
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Documents & Dates Tab - View Mode */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha Salida de Puerto</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Fecha Llegada a Puerto</p>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha Descarga</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">
                      {shipment.unloadDate ? 
                        new Date(shipment.unloadDate).toLocaleString() : 
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
                <legend className="text-sm font-medium px-2">Documentos</legend>
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
                    <span>Folio Fiscal</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.loadManoeuvre ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>Maniobra de Carga</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {shipment.pisVinculation ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />}
                    <span>Vinculacion PIS</span>
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