import React, {useState, useEffect, useMemo, useRef} from "react";
import {
    Search,
    MapPin,
    Columns,
    ListFilter,
    User,
    Truck,
    Eye,
    Lock,
    ChevronDown
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
import {Checkbox} from "@/components/ui/checkbox";
import {useNavigate} from "react-router-dom";
import {
    Shipment,
    TableColumn,
    defaultShipmentColumns,
    allShipmentColumns,
    ShipmentRequest,
    SHIPMENT_STATUS_OPTIONS
} from "@/types/shipment";
import {getStatusColor} from "@/services/shipmentService";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService, apiCarrierService} from "@/services/api";
import {UserSummaryDTO, ShipmentFilterOptionsDTO} from "@/types/api.ts";
import {Card, CardContent} from "@/components/ui/card";
import {FileText} from 'lucide-react';
import {usePermissions} from '@/hooks/usePermissions';
import {NewShipmentDialog} from "@/components/shipment/NewShipmentDialog.tsx";
import {ProgressPieChart} from "@/components/ui/progress-pie-chart.tsx";
import {apiClientService, SimplifiedClient} from "@/services/api/apiClientService.ts";
import {SimplifiedCarrier} from "@/services/api/apiCarrierService.ts";

type FilterOption = {
    status: string[];
    carrier: string[];
    client: string[]
};


const Shipments = () => {
        const navigate = useNavigate();
        const queryClient = useQueryClient();
        const [filterOpen, setFilterOpen] = useState(false);
        const [filters, setFilters] = useState<FilterOption>({status: [], carrier: [], client: []});
        const [newShipmentOpen, setNewShipmentOpen] = useState(false);
        const [currentPage, setCurrentPage] = useState(0);
        const [pageSize] = useState(10);
        const [searchTerm, setSearchTerm] = useState("");
        const [shipmentFetchType, setShipmentFetchType] = useState<'all' | 'open' | 'assigned'>(() => {
            const stored = localStorage.getItem('shipmentFetchType');
            return stored === 'all' || stored === 'open' || stored === 'assigned' ? stored : 'open';
        });


        const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
        const [dragOverPosition, setDragOverPosition] = useState<'left' | 'right' | null>(null);


        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [columns, setColumns] = useState<TableColumn[]>(() => {
            // Try to load column preferences from localStorage
            const savedColumns = localStorage.getItem("shipmentColumns");
            return savedColumns ? JSON.parse(savedColumns) : allShipmentColumns;
        });
        const {canManageShipments, canCreateShipments, isCustomerService} = usePermissions();

        const {data: transports = [], isLoading: isLoadingTransports} = useQuery<SimplifiedCarrier[]>({
            queryKey: ['transports'],
            queryFn: apiCarrierService.getAllCarriers,
            enabled: canCreateShipments(),
        });

        const {data: queryClients = [], isLoading: isLoadingClients} = useQuery<SimplifiedClient[]>({
            queryKey: ['clients'],
            queryFn: apiClientService.getAllClients,
            enabled: canCreateShipments(),
        });

        const {data: customerServiceAgents = [], isLoading: isLoadingAgents} = useQuery<UserSummaryDTO[]>({
            queryKey: ['customerServiceAgents'],
            queryFn: apiShipmentService.getCustomerServiceAgents,
            enabled: canCreateShipments(),
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
            foreignReference: "",
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
            hasCleaningAppointment: false,
            cleaningAppointmentDate: "",
            cleanArrivalDate: "",
            eir: "",
            observations: ""
        });


        // Fetch filter options
        const {data: filterOptions} = useQuery<ShipmentFilterOptionsDTO>({
            queryKey: ['shipment-filters'],
            queryFn: apiShipmentService.getFilterOptions,
            enabled: canManageShipments(),
        });

        const {
            data: shipmentsPage,
            isFetching,
            isLoading,
            error,
        } = useQuery({
            queryKey: [
                'shipments',
                shipmentFetchType,
                currentPage,
                pageSize,
                filters.status,
                filters.client,
                filters.carrier,
                debouncedSearch,
            ],
            queryFn: () => {
                if (shipmentFetchType === 'open') {
                    return apiShipmentService.getOpenShipments(
                        currentPage,
                        pageSize,
                        filters.status.length > 0 ? filters.status : undefined,
                        filters.client.length > 0 ? filters.client : undefined,
                        filters.carrier.length > 0 ? filters.carrier : undefined,
                        debouncedSearch || undefined
                    );
                } else if (shipmentFetchType === 'assigned') {
                    return apiShipmentService.getAssignedShipments(
                        currentPage,
                        pageSize,
                        filters.status.length > 0 ? filters.status : undefined,
                        filters.client.length > 0 ? filters.client : undefined,
                        filters.carrier.length > 0 ? filters.carrier : undefined,
                        debouncedSearch || undefined
                    );
                } else {
                    return apiShipmentService.getShipments(
                        currentPage,
                        pageSize,
                        filters.status.length > 0 ? filters.status : undefined,
                        filters.client.length > 0 ? filters.client : undefined,
                        filters.carrier.length > 0 ? filters.carrier : undefined,
                        debouncedSearch || undefined
                    );
                }
            },
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
                queryClient.invalidateQueries({queryKey: ['shipments']}).then(() => {
                    setNewShipmentOpen(false)


                    toast({
                        title: "Shipment Created",
                        description: `Nuevo embarque de ${newShipment.origin} a ${newShipment.destination} ha sido creado.`,
                    });

                    resetNewShipment();
                });
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
                foreignReference: "",
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
                cleaningAppointmentDate: "",
                cleanArrivalDate: "",
                eir: "",
                observations: "",
            });
        };


        const changeShipmentStatusMutation = useMutation({
            mutationFn: ({viazId, status}: { viazId: string; status: string }) =>
                apiShipmentService.changeShipmentStatus(viazId, status),
            onSuccess: (_, variables) => {

                queryClient.invalidateQueries({queryKey: ['shipments']}).then(() =>
                    toast({
                        title: "Estatus actualizado",
                        description: `El estatus del embarque ${variables.viazId} se cambió a "${variables.status}".`,
                    })
                );


            },
            onError: (error) => {
                toast({
                    title: "Error al actualizar estatus",
                    description: error.message || "Intenta de nuevo más tarde.",
                    variant: "destructive",
                });
            },
        });

        // Use filter options from API
        const carriers = filterOptions?.carriers || [];
        const statuses = filterOptions?.statuses || [];
        const clients = filterOptions?.clients || [];


        const handleFilterChange = (type: "status" | "carrier" | "client", value: string) => {
            setFilters(prev => {
                const newValues = prev[type].includes(value)
                    ? prev[type].filter(v => v !== value)
                    : [...prev[type], value];

                return {...prev, [type]: newValues};
            });
            setCurrentPage(0); // Reset to the first page when filters change
        };

        const resetFilters = () => {
            setFilters({status: [], carrier: [], client: []});
            setCurrentPage(0);
        };

        const handleInputChange = (field: keyof Shipment, value: Shipment[keyof Shipment]) => {
            setNewShipment(prev => ({...prev, [field]: value}));
        };

        const handleNewShipmentSubmit = () => {
            // Create a new shipment with the API
            createShipmentMutation.mutate(newShipment as ShipmentRequest);
        };

        const handleStatusChange = (viazId: string, status: string) => {
            changeShipmentStatusMutation.mutate({viazId, status});
        };


        // SimplifiedClient-side search filtering (since we now have server-side filters for status, client, carrier)
        const clientFilteredShipments = useMemo(() => {
            if (!shipmentsPage?.content || !searchTerm) return shipmentsPage?.content || [];

            return shipmentsPage.content.filter((shipment) => {
                const lower = searchTerm.toLowerCase();
                return (
                    shipment.fullViazId?.toLowerCase().includes(lower) ||
                    shipment.client?.name.toLowerCase().includes(lower) ||
                    shipment.origin?.toLowerCase().includes(lower) ||
                    shipment.destination?.toLowerCase().includes(lower)
                );
            });
        }, [shipmentsPage, searchTerm]);

        const filteredShipments = isFetching ? clientFilteredShipments : shipmentsPage?.content;


        const handleViewShipment = (id: string) => {
            navigate(`/shipments/${id}`);
        };


        // Function to get cell value for any column
        const getCellValue = (shipment: Shipment, columnId: string) => {
            const key = columnId as keyof Shipment;
            const value = shipment[key];

            switch (columnId) {
                case "fullViazId":
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
                            {shipment?.client?.name || "N/A"}
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

                case "status": {
                    const status = (value as string) || "";
                    const displayText =
                        status === "Vacío Pendiente" && shipment.cleaningPatio
                            ? `${status} - ${shipment.cleaningPatio}`
                            : status;

                    return (
                        <div className="w-full text-center">
                            <Badge className={getStatusColor(status)}>
                                {displayText || "N/A"}
                            </Badge>
                        </div>
                    );
                }


                case "files":
                    return value ? value.toString() : "0";

                case "hasIncidents":
                    return (
                        <Badge variant={value ? "destructive" : "secondary"} className="text-xs">
                            {value ? 'Sí' : 'No'}
                        </Badge>
                    );

                case "hasCharges":
                    return (
                        <Badge variant={value ? "destructive" : "secondary"} className="text-xs">
                            {value ? 'Sí' : 'No'}
                        </Badge>
                    );

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
                case "cleaningAppointmentDate":
                case "cleanArrivalDate":
                    return value ? new Date(value as string).toLocaleDateString() : "N/A";

                default:
                    return (value as string) || "N/A";
            }
        };

        // Calculate completion and missing fields for a shipment
        const calculateCompletionData = (shipment: Shipment) => {
            const tabFields = {
                basic: [
                    shipment.client,
                    shipment.origin,
                    shipment.destination,
                    shipment.status,
                    shipment.shipmentDate,
                    shipment.customerServiceAgent?.username,
                    shipment.typeOfService,
                    shipment.customsAgent,
                ],
                transport: [
                    shipment.transport?.name,
                    shipment.transportMethod,
                    shipment.departureDate,
                    shipment.arrivalDate,
                    shipment.unloadDate,
                ],
                contenedor: [
                    shipment.container,
                    shipment.containerType,
                    shipment.foreignReference,
                    shipment.terminal,
                ],
                vacio: [
                    shipment.cleaningOrder,
                    shipment.cleaningPatio,
                    shipment.cleaningAppointmentDate,
                    shipment.cleanArrivalDate,
                    shipment.eir,
                ],
                documents: [
                    shipment.ci,
                    shipment.ccp,
                    shipment.taxFolio,
                    shipment.loadManoeuvre,
                    shipment.pisVinculation,
                    shipment.pod,
                ],
            };

            const missingPerTab: Record<string, number> = {};
            let totalFields = 0;
            let totalMissing = 0;

            for (const [tab, fields] of Object.entries(tabFields)) {
                const missing = fields.filter(
                    (field) => !field || field === "N/A" || field.toString().trim() === ""
                ).length;
                missingPerTab[tab] = missing;
                totalFields += fields.length;
                totalMissing += missing;
            }

            const totalCompleted = totalFields - totalMissing;
            const completionPercent = totalFields === 0 ? 100 : (totalCompleted / totalFields) * 100;

            return {missingPerTab, totalFields, totalMissing, totalCompleted, completionPercent};
        };


        // Get visible columns (excluding hasIncidents and hasCharges)
        const visibleColumns = columns.filter(col => col.visible && col.id !== 'hasIncidents' && col.id !== 'hasCharges');

        const dragColumnIndex = useRef<number | null>(null);

        const getRealIndex = (visibleIndex: number) => {
            const visibleColId = visibleColumns[visibleIndex].id;
            return columns.findIndex(col => col.id === visibleColId);
        }

        const onDragStart = (e: React.DragEvent<HTMLTableCellElement>, visibleIndex: number) => {
            dragColumnIndex.current = getRealIndex(visibleIndex);
            e.dataTransfer.effectAllowed = "move";
        };

        const onDragOver = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
            e.preventDefault();

            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            // Decide if cursor is in left or right half of the header
            const position = offsetX < rect.width / 2 ? 'left' : 'right';

            setDragOverIndex(index);
            setDragOverPosition(position);

            e.dataTransfer.dropEffect = 'move';
        };


        const onDrop = (e: React.DragEvent<HTMLTableCellElement>, visibleIndex: number) => {
            e.preventDefault();

            const fromIndex = dragColumnIndex.current;
            const toIndex = getRealIndex(visibleIndex);

            if (fromIndex === null || fromIndex === toIndex) return;

            const updatedColumns = [...columns];
            const [movedColumn] = updatedColumns.splice(fromIndex, 1);
            updatedColumns.splice(toIndex, 0, movedColumn);

            setColumns(updatedColumns);
            localStorage.setItem("shipmentColumns", JSON.stringify(updatedColumns));

            setDragOverIndex(null);
            setDragOverPosition(null);
            dragColumnIndex.current = null;
        };

        const onDragLeave = () => {
            setDragOverIndex(null);
            setDragOverPosition(null);
        };


        // debounce: only update debouncedSearch 400 ms after the user stops typing
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedSearch(searchTerm);
            }, 400); // wait 400 ms after last keystroke
            return () => clearTimeout(handler);
        }, [searchTerm]);

        // Save column visibility preferences when they change
        useEffect(() => {
            localStorage.setItem("shipmentColumns", JSON.stringify(columns));
        }, [columns]);

        useEffect(() => {
            localStorage.setItem('shipmentFetchType', shipmentFetchType);
        }, [shipmentFetchType]);

        // If no permissions, show restricted access
        if (!canManageShipments()) {
            return (
                <div className="p-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
                            <p className="text-muted-foreground">
                                No tienes permisos para ver los embarques.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        }


        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Buscar..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 ml-auto">
                        {/* Shipment Type Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {shipmentFetchType === 'all' ? 'Todos los embarques' : 'Embarques abiertos'}
                                    <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>Tipo de embarques</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onSelect={() => setShipmentFetchType('open')}
                                    aria-checked={shipmentFetchType === 'open'}
                                    role="menuitemradio"
                                >
                                    Embarques abiertos
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => setShipmentFetchType('all')}
                                    aria-checked={shipmentFetchType === 'all'}
                                    role="menuitemradio"
                                >
                                    Todos los embarques
                                </DropdownMenuItem>
                                {isCustomerService() && (
                                    <DropdownMenuItem
                                        onSelect={() => setShipmentFetchType('assigned')}
                                        aria-checked={shipmentFetchType === 'assigned'}
                                        role="menuitemradio"
                                    >
                                        Embarques Asignados
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Filtrar Embarques</DialogTitle>
                                    <DialogDescription>
                                        Filtrar embarques por estatus, customer service y transporte.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <div className="mt-2 max-h-[150px] overflow-y-auto space-y-2 pr-2">
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
                                        <div className="mt-2 max-h-[150px] overflow-y-auto space-y-2 pr-2">
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
                                    <div>
                                        <Label className="text-sm font-medium">Cliente</Label>
                                        <div className="mt-2 max-h-[150px] overflow-y-auto space-y-2 pr-2">
                                            {clients.map(client => (
                                                <div key={client} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`client-${client}`}
                                                        checked={filters.client.includes(client)}
                                                        onCheckedChange={() => handleFilterChange("client", client)}
                                                    />
                                                    <Label htmlFor={`client-${client}`} className="text-sm">
                                                        {client}
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

                        {/*TODO FIX EXPORT*/}
                        {/*<ExportShipmentsDialog />*/}

                        {/* New Shipment Button - only show if user can create shipments */}
                        {canCreateShipments() && (
                            <NewShipmentDialog
                                open={newShipmentOpen}
                                onOpenChange={(open) => {
                                    // Prevent closing while data is loading
                                    if (!open && (isLoadingTransports || isLoadingClients || isLoadingAgents || createShipmentMutation.isPending)) {
                                        return;
                                    }
                                    setNewShipmentOpen(open);
                                }}
                                newShipment={newShipment}
                                handleInputChange={handleInputChange}
                                customerServiceAgents={customerServiceAgents}
                                transports={transports}
                                clients={queryClients}
                                handleNewShipmentSubmit={handleNewShipmentSubmit}
                                createShipmentMutation={createShipmentMutation}
                                resetNewShipment={resetNewShipment}
                            />
                        )}
                    </div>
                </div>

                {/* Shipments Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((column, index) => (
                                    <TableHead
                                        key={column.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, index)}
                                        onDragOver={(e) => onDragOver(e, index)}
                                        onDrop={(e) => onDrop(e, index)}
                                        onDragLeave={onDragLeave}
                                        style={{cursor: "move", position: 'relative'}}
                                    >
                                        {column.label}
                                        {dragOverIndex === index && dragOverPosition && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    bottom: 0,
                                                    width: 3,
                                                    backgroundColor: 'black',
                                                    [dragOverPosition]: 0,
                                                    zIndex: 10,
                                                }}
                                            />
                                        )}
                                    </TableHead>
                                ))}

                                <TableHead className="text-center">
                                    Progreso
                                </TableHead>
                                <TableHead className="text-center">
                                    Acciones

                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow key="loading">
                                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                                        Cargando embarques...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow key="error">
                                    <TableCell colSpan={visibleColumns.length + 2}
                                               className="text-center py-6 text-red-500">
                                        Error al cargar embarques. Por favor, intente de nuevo.
                                    </TableCell>
                                </TableRow>
                            ) : filteredShipments.length === 0 && (searchTerm || filters.status.length > 0 || filters.carrier.length > 0) ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                                        No hay embarques que coincidan con los criterios de búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : filteredShipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                                        No hay embarques disponibles.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {filteredShipments.map((shipment) => {
                                        const completionData = calculateCompletionData(shipment);

                                        return (
                                            <TableRow
                                                key={shipment.fullViazId}
                                                className={`${!shipment.open ? "opacity-60" : ""} ${
                                                    shipment.hasCharges
                                                        ? "bg-red-50 hover:bg-red-100"
                                                        : shipment.hasIncidents
                                                            ? "bg-yellow-50 hover:bg-yellow-100"
                                                            : ""
                                                }`}
                                            >
                                                {visibleColumns.map((column) => (
                                                    <TableCell key={column.id}>
                                                        {column.id === 'status' ? (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <div className="cursor-pointer w-fit">
                                                                        {getCellValue(shipment, column.id)}
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
                                                        ) : (
                                                            getCellValue(shipment, column.id)
                                                        )}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <ProgressPieChart
                                                        missingPerTab={completionData.missingPerTab}
                                                        totalMissing={completionData.totalMissing}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        {!shipment.open && (
                                                            <Badge variant="secondary"
                                                                   className="flex items-center gap-1">
                                                                <Lock className="h-3 w-3"/>
                                                                Cerrado
                                                            </Badge>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewShipment(shipment.fullViazId)}
                                                        >
                                                            <Eye/>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                            ;
                                    })}
                                </>
                            )}
                        </TableBody>

                    </Table>
                </div>

                {/* Pagination Controls */}
                {
                    shipmentsPage && shipmentsPage.page.totalPages > 1 && (
                        <div className="flex items-center justify-between px-2">
                            <div className="text-sm text-muted-foreground">
                                Mostrando
                                resultados {currentPage * pageSize + 1} a {Math.min((currentPage + 1) * pageSize, shipmentsPage.page.totalElements)} de {shipmentsPage.page.totalElements} totales
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Anterior
                                </Button>
                                <div className="text-sm">
                                    Página {currentPage + 1} de {shipmentsPage.page.totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage >= shipmentsPage.page.totalPages - 1}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
;

export default Shipments;