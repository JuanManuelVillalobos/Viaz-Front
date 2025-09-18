import {useState, useEffect} from "react";
import {
    Search, MapPin, Columns, ListFilter, User, Truck, Eye, Lock, Trash
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
    Transport,
    ShipmentRequest
} from "@/types/shipment";
import {getStatusColor} from "@/services/shipmentService";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService} from "@/services/api";
import {UserSummaryDTO, Page, ShipmentFilterOptionsDTO} from "@/types/api.ts";
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
import {NewShipmentDialog} from "@/components/shipment/NewShipmentDialog.tsx";

type FilterOption = {
    status: string[];
    carrier: string[];
    client: string[]
};

const Shipments = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOption>({status: [], carrier: [], client: []});
    const [newShipmentOpen, setNewShipmentOpen] = useState(false);
    const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [columns, setColumns] = useState<TableColumn[]>(() => {
        // Try to load column preferences from localStorage
        const savedColumns = localStorage.getItem("shipmentColumns");
        return savedColumns ? JSON.parse(savedColumns) : allShipmentColumns;
    });
    const {canManageShipments, canCreateShipments, canDeleteShipments} = usePermissions();

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
        departureDate: "",
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

    // Fetch filter options
    const {data: filterOptions} = useQuery<ShipmentFilterOptionsDTO>({
        queryKey: ['shipment-filters'],
        queryFn: apiShipmentService.getFilterOptions,
        enabled: canManageShipments(),
    });

    // Fetch shipments with React Query
    const {data: shipmentsPage, isLoading, error} = useQuery({
        queryKey: ['shipments', currentPage, pageSize, filters.status, filters.client, filters.carrier],
        queryFn: () => apiShipmentService.getShipments(
            currentPage, 
            pageSize, 
            filters.status.length > 0 ? filters.status : undefined,
            filters.client.length > 0 ? filters.client : undefined, 
            filters.carrier.length > 0 ? filters.carrier : undefined
        ),
        enabled: canManageShipments(),
    });

    const shipments = shipmentsPage?.content || [];

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
                description: `Nuevo embarque de ${newShipment.origin} a ${newShipment.destination} ha sido creado.`,
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
        setCurrentPage(0); // Reset to first page when filters change
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

    // Client-side search filtering (since we now have server-side filters for status, client, carrier)
    const filteredShipments = shipments.filter(
        (shipment) => {
            if (!searchTerm) return true;
            
            const matchesSearch =
                shipment.viazId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.destination?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
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
                            No tienes permisos para ver los embarques.
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

    // Get visible columns (excluding hasIncidents and hasCharges)
    const visibleColumns = columns.filter(col => col.visible && col.id !== 'hasIncidents' && col.id !== 'hasCharges');

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

                    {/* Export Excel Button */}
                    {/*TODO FIX EXCEL EXPORT*/}
                    {/*<Button variant="outline" size="sm" onClick={handleExportExcel}>*/}
                    {/*    <FileSpreadsheet className="mr-2 h-4 w-4"/>*/}
                    {/*    Export*/}
                    {/*</Button>*/}

                    {/* New Shipment Button - only show if user can create shipments */}
                    {canCreateShipments() && (
                        <NewShipmentDialog open={newShipmentOpen} onOpenChange={setNewShipmentOpen}
                                           newShipment={newShipment} handleInputChange={handleInputChange}
                                           customerServiceAgents={customerServiceAgents} transports={transports}
                                           handleNewShipmentSubmit={handleNewShipmentSubmit}
                                           createShipmentMutation={createShipmentMutation}
                                           resetNewShipment={resetNewShipment}/>
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
                                <TableRow key={shipment.viazId} className={`${!shipment.open ? "opacity-60" : ""} ${
                                    shipment.hasCharges ? 'bg-red-50 hover:bg-red-100' :
                                        shipment.hasIncidents ? 'bg-yellow-50 hover:bg-yellow-100' : ''
                                }`}>
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
                                                    Cerrado
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewShipment(shipment.viazId)}>
                                                <Eye/>
                                            </Button>
                                            {canDeleteShipments() && (
                                                <Button
                                                    className="text-destructive focus:text-destructive"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShipmentToDelete(shipment.viazId)}>
                                                    <Trash/>
                                                </Button>
                                            )}

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

            {/* Pagination Controls */}
            {shipmentsPage && shipmentsPage.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, shipmentsPage.totalElements)} of {shipmentsPage.totalElements} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </Button>
                        <div className="text-sm">
                            Page {currentPage + 1} of {shipmentsPage.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= shipmentsPage.totalPages - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

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