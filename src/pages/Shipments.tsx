import {useState, useEffect} from "react";
import {
    Search, MapPin, Columns, FileSpreadsheet, ListFilter, User, Truck, Plus, Eye, Lock, Trash
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {toast} from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {useNavigate} from "react-router-dom";
import {
    Shipment,
    TableColumn,
    defaultShipmentColumns,
    allShipmentColumns,
    Transport,
    ShipmentRequest
} from "@/types/shipment";
import {getStatusColor} from "@/services/shipmentService";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService} from "@/services/api";
import {Textarea} from "@/components/ui/textarea";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UserSummaryDTO} from "@/types/api.ts";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Card, CardContent} from "@/components/ui/card";
import {FileText} from 'lucide-react';
import {usePermissions} from '@/hooks/usePermissions';
import {ProgressCircle} from "@/components/ui/progress-circle.tsx";

type FilterOption = {
    status: string[];
    carrier: string[];
};

const Shipments = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOption>({status: [], carrier: []});
    const [newShipmentOpen, setNewShipmentOpen] = useState(false);
    const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null);
    const [columns, setColumns] = useState<TableColumn[]>(() => {
        // Try to load column preferences from localStorage
        const savedColumns = localStorage.getItem("shipmentColumns");
        return savedColumns ? JSON.parse(savedColumns) : allShipmentColumns;
    });
    const {canManageShipments, canCreateShipments} = usePermissions();

    const {data: transports = []} = useQuery<Transport[]>({
        queryKey: ['transports'],
        queryFn: apiShipmentService.getTransports,
        enabled: newShipmentOpen,
    });

    const {data: customerServiceAgents = []} = useQuery<UserSummaryDTO[]>({
        queryKey: ['customerServiceAgents'],
        queryFn: apiShipmentService.getCustomerServiceAgents,
        enabled: newShipmentOpen,
    });


    const [newShipment, setNewShipment] = useState<Partial<ShipmentRequest>>({
        origin: "",
        transportMethod: "",
        destination: "",
        client: "",
        transport: "",
        typeOfService: "",
        customerServiceAgent: "",
        customsAgent: "",
        status: "Información Pendiente",
        container: "",
        containerType: "",
        shipmentDate: "",
        operator: "",
        terminal: "",
        ci: false,
        ccp: false,
        taxFolio: false,
        loadManoeuvre: false,
        pisVinculation: false,
        departureDate:"",
        arrivalDate: "",
        unloadDate: "",
        cleaningOrder: "",
        pod: "",
        cleaningPatio: "",
        cleaningDate: "",
        cleanArrivalDate: "",
        eir: "",
        observations: ""
    });

    // Save column visibility preferences when they change
    useEffect(() => {
        localStorage.setItem("shipmentColumns", JSON.stringify(columns));
    }, [columns]);

    // Fetch shipments with React Query
    const {data: shipments = [], isLoading, error} = useQuery({
        queryKey: ['shipments'],
        queryFn: apiShipmentService.getAllShipments,
        enabled: canManageShipments(),
    });

    // Toggle column visibility
    const toggleColumnVisibility = (columnId: string) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === columnId ? {...col, visible: !col.visible} : col
            )
        )
    };

    // Reset column visibility to defaults
    const resetColumns = () => {
        setColumns(allShipmentColumns.map(col => ({
            ...col,
            visible: defaultShipmentColumns.some(defaultCol => defaultCol.id === col.id)
        })));
    };


    // Create a shipment mutation
    const createShipmentMutation = useMutation({
        mutationFn: apiShipmentService.createShipment,
        onSuccess: () => {
            // Invalidate and refetch shipments query
            queryClient.invalidateQueries({queryKey: ['shipments']});
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
            transportMethod: "",
            customerServiceAgent: "",
            typeOfService: "",
            client: "",
            origin: "",
            customsAgent: "",
            destination: "",
            status: "",
            container: "",
            containerType: "",
            shipmentDate: "",
            transport: "",
            operator: "",
            terminal: "",
            ci: false,
            ccp: false,
            taxFolio: false,
            loadManoeuvre: false,
            pisVinculation: false,
            departureDate: "",
            arrivalDate: "",
            unloadDate: "",
            cleaningOrder: "",
            pod: "",
            cleaningPatio: "",
            cleaningDate: "",
            cleanArrivalDate: "",
            eir: "",
            observations: "",
        });
    };

    // Delete shipment mutation
    const deleteShipmentMutation = useMutation({
        mutationFn: apiShipmentService.deleteShipment,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipments']});

            toast({
                title: "Shipment Deleted",
                description: "The shipment has been successfully deleted.",
            });
        },
    });

    // Extract unique carriers and statuses for filters
    const carriers = [...new Set(shipments.map(shipment => shipment.transport?.name || '').filter(Boolean))];
    const statuses = [...new Set(shipments.map(shipment => shipment.status || '').filter(Boolean))];

    const handleFilterChange = (type: "status" | "carrier", value: string) => {
        setFilters(prev => {
            const newValues = prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value];

            return {...prev, [type]: newValues};
        });
    };

    const resetFilters = () => {
        setFilters({status: [], carrier: []});
    };

    const handleInputChange = (field: keyof Shipment, value: Shipment[keyof Shipment]) => {
        setNewShipment(prev => ({...prev, [field]: value}));
    };

    const handleNewShipmentSubmit = () => {
        // Create a new shipment with the API
        createShipmentMutation.mutate(newShipment as ShipmentRequest);
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
                (shipment.status && filters.status.includes(shipment.status));

            const matchesCarrier =
                filters.carrier.length === 0 ||
                (shipment.transport && filters.carrier.includes(shipment.transport.name));

            return matchesSearch && matchesStatus && matchesCarrier;
        }
    );

    const handleViewShipment = (id: string) => {
        navigate(`/shipments/${id}`);
    };

    // Export to Excel function
    const handleExportExcel = async () => {
        try {
            const blob = await apiShipmentService.exportShipmentsExcel(filteredShipments);

            // Create a download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `shipments-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Export Successful",
                description: "Shipments have been exported to Excel.",
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export Failed",
                description: "There was an error exporting shipments to Excel.",
                variant: "destructive",
            });
        }
    };

    // If no permissions, show restricted access
    if (!canManageShipments()) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                        <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
                        <p className="text-muted-foreground">
                            No tienes permisos para ver los envíos.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

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

    // Function to get cell value for any column
    const getCellValue = (shipment: Shipment, columnId: string) => {
        const key = columnId as keyof Shipment;
        const value = shipment[key];

        switch (columnId) {
            case "viazId":
                return <span className="font-medium">{value as string}</span>;

            case "origin":
            case "destination":
                return (
                    <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground"/>
                        {(value as string) || "N/A"}
                    </div>
                );

            case "client":
            case "customsAgent":
                return (
                    <div className="flex items-center">
                        <User className="mr-1 h-3 w-3 text-muted-foreground"/>
                        {(value as string) || "N/A"}
                    </div>
                );

            case "transport":
                return (
                    <div className="flex items-center">
                        <Truck className="mr-1 h-3 w-3 text-muted-foreground"/>
                        {shipment.transport?.name || "N/A"}
                    </div>
                );

            case "customerServiceAgent":
                return shipment.customerServiceAgent?.username || "N/A";

            case "status":
                return (
                    <Badge className={getStatusColor((value as string) || "")}>
                        {((value as string) || "").charAt(0).toUpperCase() +
                            ((value as string) || "").slice(1) || "N/A"}
                    </Badge>
                );

            case "files":
                return value ? value.toString() : "0";

            case "ci":
            case "ccp":
            case "taxFolio":
            case "loadManoeuvre":
            case "pisVinculation":
                return (
                    <Badge variant={value ? "default" : "secondary"}>
                        {value ? "Sí" : "No"}
                    </Badge>
                );

            case "shipmentDate":
            case "departureDate":
            case "arrivalDate":
            case "unloadDate":
            case "cleaningDate":
            case "cleanArrivalDate":
                return value ? new Date(value as string).toLocaleDateString() : "N/A";

            default:
                return (value as string) || "N/A";
        }
    };

    // Calculate completion and missing fields for a shipment
    const calculateCompletionData = (shipment: Shipment) => {
        const fields = [
            shipment.client,
            shipment.origin,
            shipment.destination,
            shipment.status,
            shipment.shipmentDate,
            shipment.transport?.name,
            shipment.transportMethod,
            shipment.customerServiceAgent?.username,
            shipment.typeOfService,
            shipment.customsAgent,
            shipment.container,
            shipment.containerType,
            shipment.operator,
            shipment.terminal,
            shipment.ci,
            shipment.ccp,
            shipment.taxFolio,
            shipment.loadManoeuvre,
            shipment.pisVinculation,
            shipment.departureDate,
            shipment.arrivalDate,
            shipment.unloadDate,
            shipment.cleaningOrder,
            shipment.pod,
            shipment.cleaningPatio,
            shipment.cleaningDate,
            shipment.cleanArrivalDate,
            shipment.eir
        ];

        const filledFields = fields.filter(field => field && field !== 'N/A' && field.toString().trim() !== '').length;
        const percentage = Math.round((filledFields / fields.length) * 100);
        const missing = fields.length - filledFields;

        return {percentage, missing};
    };

    // Get visible columns
    const visibleColumns = columns.filter(col => col.visible);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search shipments..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2 ml-auto">

                    {/* Column Selection Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns className="mr-2 h-4 w-4"/>
                                Columnas
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <ScrollArea className="h-64">
                                {columns.map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.visible}
                                        onCheckedChange={() => toggleColumnVisibility(column.id)}
                                    >
                                        {column.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </ScrollArea>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={resetColumns}>
                                Seleccionar predeterminados
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Filter Dialog */}
                    <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ListFilter className="mr-2 h-4 w-4"/>
                                Filtrar {(filters.status.length > 0 || filters.carrier.length > 0) &&
                                <Badge className="ml-1 bg-primary px-1 text-[10px]">
                                    {filters.status.length + filters.carrier.length}
                                </Badge>}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Filtrar Embarques</DialogTitle>
                                <DialogDescription>
                                    Filtrar embarques por estatus, customer service y transporte.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-2 space-y-2">
                                        {statuses.map(status => (
                                            <div key={status} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`status-${status}`}
                                                    checked={filters.status.includes(status)}
                                                    onCheckedChange={() => handleFilterChange("status", status)}
                                                />
                                                <Label htmlFor={`status-${status}`} className="text-sm">
                                                    {status}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Carrier</Label>
                                    <div className="mt-2 space-y-2">
                                        {carriers.map(carrier => (
                                            <div key={carrier} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`carrier-${carrier}`}
                                                    checked={filters.carrier.includes(carrier)}
                                                    onCheckedChange={() => handleFilterChange("carrier", carrier)}
                                                />
                                                <Label htmlFor={`carrier-${carrier}`} className="text-sm">
                                                    {carrier}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={resetFilters}>
                                    Reiniciar filtros
                                </Button>
                                <Button onClick={() => setFilterOpen(false)}>
                                    Aplicar filtros
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Export Excel Button */}
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4"/>
                        Export
                    </Button>

                    {/* New Shipment Button - only show if user can create shipments */}
                    {canCreateShipments() && (
                        <Dialog open={newShipmentOpen} onOpenChange={setNewShipmentOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4"/>
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
                                                    onChange={e => handleInputChange("origin", e.target.value)}
                                                    placeholder="Ciudad, País"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="destination">Destino</Label>
                                                <Input
                                                    id="destination"
                                                    value={newShipment.destination}
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
                                                    value={newShipment.client}
                                                    onChange={e => handleInputChange("client", e.target.value)}
                                                    placeholder="Nombre del cliente"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="t_m">T/M</Label>
                                                <Select
                                                    value={newShipment.transportMethod}
                                                    onValueChange={value => handleInputChange("transportMethod", value)}
                                                >
                                                    <SelectTrigger id="t_m">
                                                        <SelectValue placeholder="Selecciona metodo de transporte"/>
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
                                                    onValueChange={value => handleInputChange("customerServiceAgent", value)}
                                                >
                                                    <SelectTrigger id="customerServiceAgent">
                                                        <SelectValue
                                                            placeholder="Ingresa el servicio al cliente"/>
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
                                                    value={newShipment.customsAgent}
                                                    onChange={e => handleInputChange("customsAgent", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="typeOfService">Tipo de Servicio</Label>
                                                <Select
                                                    value={newShipment.typeOfService}
                                                    onValueChange={value => handleInputChange("typeOfService", value)}
                                                >
                                                    <SelectTrigger id="typeOfService">
                                                        <SelectValue placeholder="Selecciona tipo de servicio"/>
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
                                                    onValueChange={value => handleInputChange("status", value)}
                                                >
                                                    <SelectTrigger id="status">
                                                        <SelectValue placeholder="Estatus"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Información Pendiente">Información
                                                            Pendiente</SelectItem>
                                                        <SelectItem value="Folio Pendiente">Folio
                                                            Pendiente</SelectItem>
                                                        <SelectItem value="Maniobras Pendientes">Maniobras
                                                            Pendiente</SelectItem>
                                                        <SelectItem value="Todo Ok">Todo Ok</SelectItem>
                                                        <SelectItem value="En Puerto">En Puerto</SelectItem>
                                                        <SelectItem value="En Transito">En Transito</SelectItem>
                                                        <SelectItem value="En Destino">En Destino</SelectItem>
                                                        <SelectItem value="POD Pendiente">POD Pendiente</SelectItem>
                                                        <SelectItem value="Vacío Pendiente"> Vacío
                                                            Pendiente</SelectItem>
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
                                                    onChange={e => handleInputChange("container", e.target.value)}
                                                    placeholder="Ingrese número de contenedor"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="containerType">Tipo de Contenedor</Label>
                                                <Select
                                                    value={newShipment.containerType}
                                                    onValueChange={value => handleInputChange("containerType", value)}
                                                >
                                                    <SelectTrigger id="containerType">
                                                        <SelectValue
                                                            placeholder="Selecciona el tipo de contenedor"/>
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
                                                    onChange={e => handleInputChange("shipmentDate", e.target.value)}
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
                                                    onValueChange={value => handleInputChange("transport", value)}
                                                >
                                                    <SelectTrigger id="transport">
                                                        <SelectValue
                                                            placeholder="Selecciona el transporte"/>
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
                                                <Label htmlFor="shipmentOperator">Operador o Referencia</Label>
                                                <Input
                                                    id="shipmentOperator"
                                                    value={newShipment.operator}
                                                    onChange={e => handleInputChange("operator", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="shipmentTerminal">Terminal</Label>
                                                <Input
                                                    id="shipmentTerminal"
                                                    value={newShipment.terminal}
                                                    onChange={e => handleInputChange("terminal", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="portOfDischarge">POD</Label>
                                                <Select
                                                    value={newShipment.pod}
                                                    onValueChange={value => handleInputChange("pod", value)}
                                                >
                                                    <SelectTrigger id="portOfDischarge">
                                                        <SelectValue
                                                            placeholder="Selecciona el estatus del POD"/>
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
                                                    onChange={e => handleInputChange("departureDate", e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="portArrivalDate">Fecha Llegada a Puerto</Label>
                                                <Input
                                                    id="portArrivalDate"
                                                    type="datetime-local"
                                                    value={newShipment.arrivalDate}
                                                    onChange={e => handleInputChange("arrivalDate", e.target.value)}
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
                                                    onChange={e => handleInputChange("unloadDate", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eir">EIR</Label>
                                                <Select
                                                    value={newShipment.eir}
                                                    onValueChange={value => handleInputChange("eir", value)}
                                                >
                                                    <SelectTrigger id="eir">
                                                        <SelectValue
                                                            placeholder="Selecciona el EIR"/>
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
                                                    <Label htmlFor="taxFolio">Folio Fiscal</Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="loadManoeuvre"
                                                        checked={newShipment.loadManoeuvre}
                                                        onCheckedChange={checked => handleInputChange("loadManoeuvre", checked)}
                                                    />
                                                    <Label htmlFor="loadManoeuvre">Maniobra de Carga</Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="pisVinculation"
                                                        checked={newShipment.pisVinculation}
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
                                                value={newShipment.observations}
                                                onChange={e => handleInputChange("observations", e.target.value)}
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
                                                    onValueChange={value => handleInputChange("cleaningOrder", value)}
                                                >
                                                    <SelectTrigger id="vacuumManoeuvre">
                                                        <SelectValue placeholder="Selecciona estatus"/>
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
                                                    onChange={e => handleInputChange("cleaningDate", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="containerType">Patio</Label>
                                                <Select
                                                    value={newShipment.cleaningPatio}
                                                    onValueChange={value => handleInputChange("cleaningPatio", value)}
                                                >
                                                    <SelectTrigger id="cleaningPatio">
                                                        <SelectValue
                                                            placeholder="Selecciona el patio"/>
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
                                                    onChange={e => handleInputChange("cleanArrivalDate", e.target.value)}
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
                    )}
                </div>
            </div>

            {/* Shipments Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead key={column.id}>
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead>
                                Progreso
                            </TableHead>
                            <TableHead>
                                Acciones

                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredShipments.map((shipment) => {
                            const completionData = calculateCompletionData(shipment);

                            return (
                                <TableRow key={shipment.viazId} className={!shipment.open ? "opacity-60" : ""}>
                                    {visibleColumns.map((column) => (
                                        <TableCell key={column.id}>
                                            {getCellValue(shipment, column.id)}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <ProgressCircle
                                            progress={completionData.percentage}
                                            missing={completionData.missing}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {!shipment.open && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Lock className="h-3 w-3"/>
                                                    Closed
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewShipment(shipment.viazId)}>
                                                <Eye/>
                                            </Button>
                                            <Button
                                                className="text-destructive focus:text-destructive"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShipmentToDelete(shipment.viazId)}>
                                                <Trash/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {filteredShipments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                                    {searchTerm || filters.status.length > 0 || filters.carrier.length > 0
                                        ? "No hay embarques que coincidan con los criterios de busqueda."
                                        : "No hay embarques disponibles."
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!shipmentToDelete} onOpenChange={(open) => !open && setShipmentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this shipment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (shipmentToDelete) {
                                    deleteShipmentMutation.mutate(shipmentToDelete);
                                    setShipmentToDelete(null);
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Shipments;