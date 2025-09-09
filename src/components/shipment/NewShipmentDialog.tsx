import { Plus } from "lucide-react"; // Assuming Plus icon is imported from lucide-react
import { Button } from "../ui/button"; // Adjust path as needed
import { Checkbox } from "../ui/checkbox"; // Adjust path as needed
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"; // Adjust path as needed
import { Input } from "../ui/input"; // Adjust path as needed
import { Label } from "../ui/label"; // Adjust path as needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Adjust path as needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"; // Adjust path as needed
import { Textarea } from "../ui/textarea";
import {Shipment, ShipmentRequest, Transport} from "@/types/shipment.ts";
import {UserSummaryDTO} from "@/types/api.ts"; // Adjust path as needed


// Define the props for the NewShipmentDialog component
interface NewShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newShipment: Partial<ShipmentRequest>;
  handleInputChange: (field: keyof Shipment, value: any) => void;
  customerServiceAgents: UserSummaryDTO[];
  transports: Transport[];
  handleNewShipmentSubmit: () => void;
  createShipmentMutation: {
    isPending: boolean;
  };
  resetNewShipment: () => void;
  // The original component had canCreateShipments() condition,
  // but it seems to control the DialogTrigger, not the dialog itself.
  // We'll assume the parent component handles whether to render this dialog or not based on that.
}

export function NewShipmentDialog({
  open,
  onOpenChange,
  newShipment,
  handleInputChange,
  customerServiceAgents,
  transports,
  handleNewShipmentSubmit,
  createShipmentMutation,
  resetNewShipment,
}: NewShipmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo embarque</DialogTitle>
          <DialogDescription>
            Llena la información para crear un nuevo embarque.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="transport">Transporte</TabsTrigger>
            <TabsTrigger value="contenedor">Contenedor</TabsTrigger>
            <TabsTrigger value="vacio">Vacío</TabsTrigger>
            <TabsTrigger value="documents">Documentos & Fechas</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origen</Label>
                <Input
                  id="origin"
                  value={newShipment.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  value={newShipment.destination}
                  onChange={(e) =>
                    handleInputChange("destination", e.target.value)
                  }
                  placeholder="Ciudad, País"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  value={newShipment.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t_m">T/M</Label>
                <Select
                  value={newShipment.transportMethod}
                  onValueChange={(value) =>
                    handleInputChange("transportMethod", value)
                  }
                >
                  <SelectTrigger id="t_m">
                    <SelectValue placeholder="Selecciona metodo de transporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Terrestre">Terrestre</SelectItem>
                    <SelectItem value="Marítimo">Marítimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerServiceAgent">Customer Service</Label>
                <Select
                  value={newShipment.customerServiceAgent}
                  onValueChange={(value) =>
                    handleInputChange("customerServiceAgent", value)
                  }
                >
                  <SelectTrigger id="customerServiceAgent">
                    <SelectValue placeholder="Ingresa el servicio al cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerServiceAgents.map((agent, index) => (
                      <SelectItem
                        key={agent.userId || agent.username || index}
                        value={agent.username}
                      >
                        {agent.username.charAt(0).toUpperCase() +
                          agent.username.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customsAgent">Agente Aduanal</Label>
                <Input
                  id="customsAgent"
                  value={newShipment.customsAgent}
                  onChange={(e) =>
                    handleInputChange("customsAgent", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeOfService">Tipo de Servicio</Label>
                <Select
                  value={newShipment.typeOfService}
                  onValueChange={(value) =>
                    handleInputChange("typeOfService", value)
                  }
                >
                  <SelectTrigger id="typeOfService">
                    <SelectValue placeholder="Selecciona tipo de servicio" />
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
                  value={newShipment.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Información Pendiente">
                      Información Pendiente
                    </SelectItem>
                    <SelectItem value="Folio Pendiente">
                      Folio Pendiente
                    </SelectItem>
                    <SelectItem value="Maniobras Pendientes">
                      Maniobras Pendiente
                    </SelectItem>
                    <SelectItem value="Todo Ok">Todo Ok</SelectItem>
                    <SelectItem value="En Puerto">En Puerto</SelectItem>
                    <SelectItem value="En Transito">En Transito</SelectItem>
                    <SelectItem value="En Destino">En Destino</SelectItem>
                    <SelectItem value="POD Pendiente">POD Pendiente</SelectItem>
                    <SelectItem value="Vacío Pendiente">
                      {" "}
                      Vacío Pendiente
                    </SelectItem>
                    <SelectItem value="Ingresado">Ingresado</SelectItem>
                    <SelectItem value="Egresado">Egresado</SelectItem>
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
                  value={newShipment.container}
                  onChange={(e) =>
                    handleInputChange("container", e.target.value)
                  }
                  placeholder="Ingrese número de contenedor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="containerType">Tipo de Contenedor</Label>
                <Select
                  value={newShipment.containerType}
                  onValueChange={(value) =>
                    handleInputChange("containerType", value)
                  }
                >
                  <SelectTrigger id="containerType">
                    <SelectValue placeholder="Selecciona el tipo de contenedor" />
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
                <Label htmlFor="shipmentDate">Fecha de Carga</Label>
                <Input
                  id="shipmentDate"
                  type="datetime-local"
                  value={newShipment.shipmentDate}
                  onChange={(e) =>
                    handleInputChange("shipmentDate", e.target.value)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transport">Transporte</Label>
                <Select
                  value={newShipment.transport}
                  onValueChange={(value) =>
                    handleInputChange("transport", value)
                  }
                >
                  <SelectTrigger id="transport">
                    <SelectValue placeholder="Selecciona el transporte" />
                  </SelectTrigger>
                  <SelectContent>
                    {transports.map((transportItem, index) => (
                      <SelectItem
                        key={transportItem.id || transportItem.name || index}
                        value={transportItem.name}
                      >
                        {transportItem.name.charAt(0).toUpperCase() +
                          transportItem.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipmentOperator">Operador o Referencia</Label>
                <Input
                  id="shipmentOperator"
                  value={newShipment.operator}
                  onChange={(e) =>
                    handleInputChange("operator", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shipmentTerminal">Terminal</Label>
                <Input
                  id="shipmentTerminal"
                  value={newShipment.terminal}
                  onChange={(e) =>
                    handleInputChange("terminal", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portOfDischarge">POD</Label>
                <Select
                  value={newShipment.pod}
                  onValueChange={(value) => handleInputChange("pod", value)}
                >
                  <SelectTrigger id="portOfDischarge">
                    <SelectValue placeholder="Selecciona el estatus del POD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Documents & Dates Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portDepartureDate">Fecha Salida de Puerto</Label>
                <Input
                  id="portDepartureDate"
                  type="date"
                  value={newShipment.departureDate}
                  onChange={(e) =>
                    handleInputChange("departureDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portArrivalDate">Fecha Llegada a Puerto</Label>
                <Input
                  id="portArrivalDate"
                  type="datetime-local"
                  value={newShipment.arrivalDate}
                  onChange={(e) =>
                    handleInputChange("arrivalDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portUnloadDate">Fecha Descarga</Label>
                <Input
                  id="portUnloadDate"
                  type="datetime-local"
                  value={newShipment.unloadDate}
                  onChange={(e) =>
                    handleInputChange("unloadDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eir">EIR</Label>
                <Select
                  value={newShipment.eir}
                  onValueChange={(value) => handleInputChange("eir", value)}
                >
                  <SelectTrigger id="eir">
                    <SelectValue placeholder="Selecciona el EIR" />
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
                    checked={newShipment.ci}
                    onCheckedChange={(checked) => handleInputChange("ci", checked)}
                  />
                  <Label htmlFor="ci">CI</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ccp"
                    checked={newShipment.ccp}
                    onCheckedChange={(checked) => handleInputChange("ccp", checked)}
                  />
                  <Label htmlFor="ccp">CCP</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxFolio"
                    checked={newShipment.taxFolio}
                    onCheckedChange={(checked) =>
                      handleInputChange("taxFolio", checked)
                    }
                  />
                  <Label htmlFor="taxFolio">Folio Fiscal</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loadManoeuvre"
                    checked={newShipment.loadManoeuvre}
                    onCheckedChange={(checked) =>
                      handleInputChange("loadManoeuvre", checked)
                    }
                  />
                  <Label htmlFor="loadManoeuvre">Maniobra de Carga</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pisVinculation"
                    checked={newShipment.pisVinculation}
                    onCheckedChange={(checked) =>
                      handleInputChange("pisVinculation", checked)
                    }
                  />
                  <Label htmlFor="pisVinculation">Vinculacion PIS</Label>
                </div>
              </div>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={newShipment.observations}
                onChange={(e) =>
                  handleInputChange("observations", e.target.value)
                }
                placeholder="Add any additional notes here..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/*Cleaning Tab*/}
          <TabsContent value="vacio" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vacuumManoeuvre">Maniobra de Vacío</Label>
                <Select
                  value={newShipment.cleaningOrder}
                  onValueChange={(value) =>
                    handleInputChange("cleaningOrder", value)
                  }
                >
                  <SelectTrigger id="vacuumManoeuvre">
                    <SelectValue placeholder="Selecciona estatus" />
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
                <Label htmlFor="cleaningDate">Fecha de Vacío</Label>
                <Input
                  id="cleaningDate"
                  type="datetime-local"
                  value={newShipment.cleaningDate}
                  onChange={(e) =>
                    handleInputChange("cleaningDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="containerType">Patio</Label>
                <Select
                  value={newShipment.cleaningPatio}
                  onValueChange={(value) =>
                    handleInputChange("cleaningPatio", value)
                  }
                >
                  <SelectTrigger id="cleaningPatio">
                    <SelectValue placeholder="Selecciona el patio" />
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
              <div className="space-y-2">
                <Label htmlFor="cleanArrivalDate">Entrega de Vacío</Label>
                <Input
                  id="cleanArrivalDate"
                  type="date"
                  value={newShipment.cleanArrivalDate}
                  onChange={(e) =>
                    handleInputChange("cleanArrivalDate", e.target.value)
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetNewShipment();
              onOpenChange(false); // Close dialog
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
  );
}