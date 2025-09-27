import {Calendar, Truck, MapPin, User, Check, X, Tag} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Shipment, SHIPMENT_STATUS_OPTIONS, Transport} from "@/types/shipment.ts";
import {UserSummaryDTO} from "@/types/api.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

interface ShipmentDetailFormProps {
    shipment: Shipment;
    isEditing: boolean;
    editedShipment: Shipment;
    handleInputChange: (field: keyof Shipment, value: string | boolean | number | Transport | UserSummaryDTO) => void;
    getStatusColor: (status: string) => string;
    transports: Transport[];
    customerServiceAgents: UserSummaryDTO[];
    isLoadingTransports: boolean;
    isLoadingCustomerServiceAgents: boolean;
    handleStatusChange: (viazId: string, status: string) => void;
}

export const ShipmentDetailForm = ({
                                       shipment,
                                       isEditing,
                                       editedShipment,
                                       handleInputChange,
                                       getStatusColor,
                                       transports,
                                       isLoadingTransports,
                                       customerServiceAgents,
                                       isLoadingCustomerServiceAgents,
                                       handleStatusChange
                                   }: ShipmentDetailFormProps) => {

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5"/>
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
                                    <Label htmlFor="origin">Origen</Label>
                                    <Input
                                        id="origin"
                                        value={editedShipment.origin || ''}
                                        onChange={e => handleInputChange("origin", e.target.value)}
                                        placeholder="Ciudad, País"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="destination">Destino</Label>
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
                                    <Label htmlFor="client">Cliente</Label>
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
                                            <SelectValue placeholder="Tipo de transporte"/>
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
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedAgent = customerServiceAgents.find(agent => agent.username === value);
                                            if (selectedAgent) {
                                                handleInputChange("customerServiceAgent", selectedAgent);
                                            }
                                        }}
                                        value={editedShipment.customerServiceAgent?.username || ""}
                                        disabled={!isEditing || isLoadingCustomerServiceAgents}

                                    >
                                        <SelectTrigger id="customerServiceAgent">
                                            <SelectValue
                                                placeholder={isLoadingCustomerServiceAgents ? "Cargando agentes" : "Ingresa el agente de servicio del cliente"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customerServiceAgents.map((agent, index) => (
                                                <SelectItem
                                                    key={agent.userId || agent.username || index}
                                                    value={agent.username}>
                                                    {agent.username.charAt(0).toUpperCase() + agent.username.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                            <SelectValue placeholder="Tipo de servicio"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full">Full</SelectItem>
                                            <SelectItem value="Sencillo">Sencillo</SelectItem>
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
                                            <SelectValue placeholder="Información Pendiente"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SHIPMENT_STATUS_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="foreignReference">Referencia externa</Label>
                                <Input
                                    id="foreignReference"
                                    value={editedShipment.foreignReference || ''}
                                    onChange={e => handleInputChange("foreignReference", e.target.value)}
                                />
                            </div>
                        </TabsContent>

                        {/* Transportation Tab */}
                        <TabsContent value="transport" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="transport">Transporte</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedTransport = transports.find(t => t.name === value);
                                            if (selectedTransport) {
                                                handleInputChange("transport", selectedTransport);
                                            }
                                        }}
                                        value={editedShipment.transport?.name || ""}
                                        disabled={!isEditing || isLoadingTransports} // Disable if loading

                                    >
                                        <SelectTrigger id="transport">
                                            <SelectValue
                                                placeholder={isLoadingTransports ? "Cargando transportes" : "Transporte"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transports.map((transportItem, index) => (
                                                <SelectItem
                                                    key={transportItem.id || transportItem.name || index}
                                                    value={transportItem.name}>
                                                    {transportItem.name.charAt(0).toUpperCase() + transportItem.name.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pod">POD</Label>
                                    <Select
                                        value={editedShipment.pod || ''}
                                        onValueChange={value => handleInputChange("pod", value)}
                                    >
                                        <SelectTrigger id="pod">
                                            <SelectValue placeholder="Estatus del POD"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Enviado">Enviado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Container Tab */
                        }
                        <TabsContent value="contenedor" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="container">Número de Contenedor</Label>
                                    <Input
                                        id="container"
                                        value={editedShipment.container || ''}
                                        onChange={e => handleInputChange("container", e.target.value)}
                                        placeholder="Número de contenedor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="containerType">Tipo de Contenedor</Label>
                                    <Select
                                        value={editedShipment.containerType || ''}
                                        onValueChange={value => handleInputChange("containerType", value)}
                                    >
                                        <SelectTrigger id="containerType">
                                            <SelectValue placeholder="Tipo de contenedor"/>
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
                                    <Label htmlFor="shipmentDate">Cita de Carga</Label>
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
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Vacuum Tab */
                        }
                        <TabsContent value="vacio" className="space-y-4">
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <Label htmlFor="hasCleaningAppointment"
                                           className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="hasCleaningAppointment"
                                            type="checkbox"
                                            checked={editedShipment.hasCleaningAppointment || false}
                                            onChange={(e) =>
                                                handleInputChange("hasCleaningAppointment", e.target.checked)
                                            }
                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        ¿Hay cita de vacío?
                                    </Label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cleaningOrder">Maniobra de Vacío</Label>
                                    <Select
                                        value={editedShipment.cleaningOrder || ''}
                                        onValueChange={value => handleInputChange("cleaningOrder", value)}
                                    >
                                        <SelectTrigger id="cleaningOrder">
                                            <SelectValue placeholder="Estatus del vacío"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Solicitada">Solicitada</SelectItem>
                                            <SelectItem value="Enviada">Enviada</SelectItem>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Completada">Completada</SelectItem>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cleaningPatio">Patio</Label>
                                    <Select
                                        value={editedShipment.cleaningPatio || ''}
                                        onValueChange={value => handleInputChange("cleaningPatio", value)}
                                    >
                                        <SelectTrigger id="cleaningPatio">
                                            <SelectValue placeholder="Patio"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SSA">SSA</SelectItem>
                                            <SelectItem value="TIMSA">TIMSA</SelectItem>
                                            <SelectItem value="CIMA">CIMA</SelectItem>
                                            <SelectItem value="OCUPA">OCUPA</SelectItem>
                                            <SelectItem value="ISL">ISL</SelectItem>
                                            <SelectItem value="CISE">CISE</SelectItem>
                                            <SelectItem value="Otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {editedShipment.hasCleaningAppointment && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cleaningAppointmentDate">Fecha de Cita de Vacío</Label>
                                        <Input
                                            id="cleaningAppointmentDate"
                                            type="datetime-local"
                                            value={editedShipment.cleaningAppointmentDate || ''}
                                            onChange={(e) =>
                                                handleInputChange("cleaningAppointmentDate", e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Documents & Dates Tab */
                        }
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
                                    <Label htmlFor="arrivalDate">Fecha Llegada a Destino</Label>
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
                                            <SelectValue placeholder="EIR"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="No dieron">No dieron</SelectItem>
                                            <SelectItem value="Enviado">Enviado</SelectItem>
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
                                <Label htmlFor="observations">Observaciones</Label>
                                <Textarea
                                    id="observations"
                                    value={editedShipment.observations || ''}
                                    onChange={e => handleInputChange("observations", e.target.value)}
                                    placeholder="Agrega notas adicionales aquí..."
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
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">{shipment.origin || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Destino</p>
                                    <div className="flex items-center mt-1">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">{shipment.destination || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                                    <div className="flex items-center mt-1">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                        <User className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">{shipment.customerServiceAgent ? shipment.customerServiceAgent.username : 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Agente Aduanal</p>
                                    <div className="flex items-center mt-1">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="cursor-pointer w-fit">
                                                    <Badge className={getStatusColor(shipment.status || '')}>
                                                        {shipment.status
                                                            ? shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)
                                                            : 'Unknown'}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {SHIPMENT_STATUS_OPTIONS.map((status) => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        onSelect={() => handleStatusChange(shipment.fullViazId, status)}
                                                    >
                                                        {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Referencia Externa</p>
                                    <div className="flex items-center mt-1">
                                        <Tag className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">{shipment.foreignReference || 'N/A'}</p>
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
                                        <Truck className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">{shipment.transport ? shipment.transport.name : 'N/A'}</p>
                                    </div>
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
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                    <p className="text-sm font-medium text-muted-foreground">Entrega de Vacío</p>
                                    <div className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <p className="text-base">
                                            {shipment.cleanArrivalDate ?
                                                new Date(shipment.cleanArrivalDate).toLocaleDateString() :
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
                                    {shipment.hasCleaningAppointment == true ? (
                                        <>
                                            <p className="text-sm font-medium text-muted-foreground">Fecha de Cita de
                                                Vacío</p>
                                            <div className="flex items-center mt-1">
                                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
                                                <p className="text-base">
                                                    {shipment.cleaningAppointmentDate ?
                                                        new Date(shipment.cleaningAppointmentDate).toLocaleString() :
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic mt-1">
                                            No hay cita de vacío
                                        </p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Documents & Dates Tab - View Mode */}
                        <TabsContent value="documents" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Fecha Salida de Puerto</p>
                                    <div className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
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
                                            <Check className="h-4 w-4 text-green-500"/> :
                                            <X className="h-4 w-4 text-red-500"/>}
                                        <span>CI</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {shipment.ccp ?
                                            <Check className="h-4 w-4 text-green-500"/> :
                                            <X className="h-4 w-4 text-red-500"/>}
                                        <span>CCP</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {shipment.taxFolio ?
                                            <Check className="h-4 w-4 text-green-500"/> :
                                            <X className="h-4 w-4 text-red-500"/>}
                                        <span>Folio Fiscal</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {shipment.loadManoeuvre ?
                                            <Check className="h-4 w-4 text-green-500"/> :
                                            <X className="h-4 w-4 text-red-500"/>}
                                        <span>Maniobra de Carga</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {shipment.pisVinculation ?
                                            <Check className="h-4 w-4 text-green-500"/> :
                                            <X className="h-4 w-4 text-red-500"/>}
                                        <span>Vinculacion PIS</span>
                                    </div>
                                </div>
                            </fieldset>

                            {shipment.observations && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
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
    )
        ;
};