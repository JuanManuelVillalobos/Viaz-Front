import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    Lock,
    AlertTriangle,
    Unlock,
    DollarSign,
    Plus,
    Trash,
    Undo
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService, apiIncidentService, apiChargeService, apiCarrierService} from '@/services/api';
import {getStatusColor} from "@/services/shipmentService";
import {usePermissions} from '@/hooks/usePermissions';

import {ShipmentDetailForm} from "@/components/shipment/ShipmentDetailForm";
import {ShipmentFilesCard} from "@/components/shipment/ShipmentFilesCard";
import {DocumentViewer} from "@/components/shipment/DocumentViewer";
import {Shipment, ShipmentRequest} from "@/types/shipment";
import {ShipmentCloseRequestDTO, UserSummaryDTO} from "@/types/api.ts";
import {ShipmentIncidentsChargesCard} from "@/components/shipment/ShipmentIncidentsChargesCard.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {ShipmentRescheduleCard} from "@/components/shipment/ShipmentRescheduleCard.tsx";
import {apiClientService, SimplifiedClient} from "@/services/api/apiClientService.ts";
import {SimplifiedCarrier} from "@/services/api/apiCarrierService.ts";

const ShipmentDetail = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editedShipment, setEditedShipment] = useState<Shipment | null>(null);
    const [draggedFile, setDraggedFile] = useState<string | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [viewingDocument, setViewingDocument] = useState<{
        objectKey: string,
        fileName: string,
        url: string
    } | null>(null);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);
    const [closeShipmentOpen, setCloseShipmentOpen] = useState(false);
    const [clientCustomerServiceRating, setClientCustomerServiceRating] = useState(10);
    const [carrierCustomerServiceRating, setCarrierCustomerServiceRating] = useState(10);
    const [clientObservations, setClientObservations] = useState("");
    const [carrierObservations, setCarrierObservations] = useState("");

    // Incidents
    const [addIncidentOpen, setAddIncidentOpen] = useState(false);
    const [selectedEntityTied, setSelectedEntityTied] = useState<string>("CARRIER");
    const [selectedIncidentType, setSelectedIncidentType] = useState<string>("");
    const [incidentComment, setIncidentComment] = useState("");


    const [selectedChargeType, setSelectedChargeType] = useState<string>("");
    const [chargeDialogOpen, setChargeDialogOpen] = useState(false);
    const [chargeComment, setChargeComment] = useState("");

    const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null);
    const [shipmentToCreateVariant, setShipmentToCreateVariant] = useState<string | null>(null);


    const {canCloseShipments, canCreateShipments, canDeleteShipments, canRestoreShipments} = usePermissions();

    // Fetch shipment data
    const {
        data: shipment,
        isLoading,
        error
    } = useQuery({
        queryKey: ['shipment', id],
        queryFn: () => id ? apiShipmentService.getShipmentById(id) : Promise.reject('No ID provided'),
        enabled: !!id
    });

    // Fetch available carriers
    const {data: carriers = [], isLoading: isLoadingTransports} = useQuery<SimplifiedCarrier[]>({
        queryKey: ['transports'],
        queryFn: apiCarrierService.getAllCarriers,
        enabled: isEditing, // Only fetch when in editing mode
    });

    // Fetch available customer service agents
    const {data: customerServiceAgents = [], isLoading: isLoadingCustomerServiceAgents} = useQuery<UserSummaryDTO[]>({
        queryKey: ['customerServiceAgents'],
        queryFn: apiShipmentService.getCustomerServiceAgents,
        enabled: isEditing, // Only fetch when in editing mode
    });

    // Fetch available clients
    const {data: clients = [], isLoading: isLoadingClients} = useQuery<SimplifiedClient[]>({
        queryKey: ['clients'],
        queryFn: apiClientService.getAllClients,
        enabled: isEditing, // Only fetch when in editing mode
    });


    // Fetch shipment variants if hasVariants is true
    const {
        data: variants = [],
        isLoading: isLoadingVariants
    } = useQuery({
        queryKey: ['shipmentVariants', id],
        queryFn: () => id ? apiShipmentService.getShipmentVariants(id) : Promise.reject('No ID provided'),
        enabled: !!id && !!shipment?.hasVariants
    });

    // Create variant mutation
    const createVariantMutation = useMutation({
        mutationFn: apiShipmentService.createShipmentVariant,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            await queryClient.invalidateQueries({queryKey: ['shipmentVariants', id]});
            toast({
                title: "Exito",
                description: "Variante creada correctamente.",
            });
        },
        onError: () => {
            console.error("Error creating variant:", error);
            toast({
                title: "Error",
                description: "Failed to create variant.",
                variant: "destructive",
            });
        }
    });

    // Fetch incident types
    const {data: incidentTypes = [], isLoading: isLoadingIncidentTypes} = useQuery({
        queryKey: ['incidentTypes'],
        queryFn: apiIncidentService.getAllIncidentTypes,
        enabled: addIncidentOpen
    });


    const shipmentAvailableToInteract = shipment?.open && !shipment?.deleted;

    // Fetch charge types
    const {data: chargeTypes = [], isLoading: isLoadingChargeTypes} = useQuery({
        queryKey: ['chargeTypes'],
        queryFn: apiChargeService.getAllChargeTypes,
        enabled: chargeDialogOpen
    });

    const {
        data: shipmentCharges = [],
        isLoading: isLoadingCharges,
        error: chargesError,
    } = useQuery({
        queryKey: ['shipmentCharges', id],
        queryFn: () => apiShipmentService.getShipmentCharges(id),
        enabled: !!id,
    });

    const {
        data: shipmentIncidents = [],
        isLoading: isLoadingIncidents,
        error: incidentsError,
    } = useQuery({
        queryKey: ['shipmentIncidents', id],
        queryFn: () => apiShipmentService.getShipmentIncidents(id),
        enabled: !!id,
    });

    // Delete shipment mutation
    const deleteShipmentMutation = useMutation({
        mutationFn: apiShipmentService.deleteShipment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['shipments']});
            await queryClient.invalidateQueries({queryKey: ['shipment', id]});

            toast({
                title: "Embarque Eliminado",
                description: "El embarque ha sido eliminado correctamente.",
            });
        },
    });


    // Update shipment mutation
    const updateShipmentMutation = useMutation({
        mutationFn: ({id, updates}: { id: string, updates: Partial<ShipmentRequest> }) =>
            apiShipmentService.updateShipment(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            setIsEditing(false);
            toast({
                title: "Exito",
                description: "Detalles del embarque actualizados correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Error al actualizar detalles del embarque.",
                variant: "destructive",
            });
        }
    });

    // Fetch shipment documents
    const {
        data: documents = [],
        isLoading: isLoadingDocuments,
        refetch: refetchDocuments
    } = useQuery({
        queryKey: ['shipmentDocuments', id],
        queryFn: () => id ? apiShipmentService.getShipmentDocuments(id) : Promise.reject('No ID provided'),
        enabled: !!id
    });

    // File upload mutation
    const uploadFileMutation = useMutation({
        mutationFn: ({viazId, file}: { viazId: string, file: File }) =>
            apiShipmentService.uploadFile(viazId, file),
        onSuccess: () => {
            refetchDocuments();
            toast({
                title: "Exito",
                description: "Documento subido correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Error al subir el documento.",
                variant: "destructive",
            });
        }
    });

    // Delete document mutation
    const deleteDocumentMutation = useMutation({
        mutationFn: ({viazId, objectKey}: { viazId: string, objectKey: string }) =>
            apiShipmentService.deleteDocument(viazId, objectKey),
        onSuccess: () => {
            refetchDocuments();
            toast({
                title: "Exito",
                description: "Documento eliminado exitosamente.",
            });
        },
        onError: () => {
            console.error("Error deleting document:", error);
            toast({
                title: "Error",
                description: "Error al eliminar documento.",
                variant: "destructive",
            });
        }
    });

    // Add incident mutation
    const addIncidentMutation = useMutation({
        mutationFn: ({viazId, incidentId, comment}: { viazId: string, incidentId: number, comment: string }) =>
            apiIncidentService.addIncidentToShipment(viazId, incidentId, comment),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['shipmentIncidents', id]});
            setAddIncidentOpen(false);
            setSelectedIncidentType("");
            toast({
                title: "Exito",
                description: "Incidente añadido a el embarque exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Error al añadir incidente al embarque.",
                variant: "destructive",
            });
        }
    });

    // Add charge mutation
    const addChargeMutation = useMutation({
        mutationFn: ({viazId, chargeId, comment}: { viazId: string, chargeId: number, comment: string }) =>
            apiChargeService.addChargeToShipment(viazId, chargeId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipmentCharges', id]});
            setChargeDialogOpen(false);
            setSelectedChargeType("");
            toast({
                title: "Exito",
                description: "Cargo añadido al embarque exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Error al añadir cargo al embarque.",
                variant: "destructive",
            });
        }
    });

    useEffect(() => {
        if (shipment) {
            setEditedShipment({...shipment});
        }
    }, [shipment]);

    const handleBack = () => {
        navigate("/shipments");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (shipment) {
            setEditedShipment({...shipment});
        }
    };

    const handleSave = async () => {
        if (editedShipment && id) {
            const {...rest} = editedShipment;
            const updates: Partial<ShipmentRequest> = {
                ...rest,
                transport: editedShipment.transport ? editedShipment.transport.name : undefined,
                customerServiceAgent: editedShipment.customerServiceAgent ? editedShipment.customerServiceAgent.username : undefined,
                client: editedShipment.client ? editedShipment.client.name : undefined
            };
            updateShipmentMutation.mutate({id, updates});
        }
    };


    const handleInputChange = (field: keyof Shipment, value: string | boolean | number | SimplifiedCarrier | UserSummaryDTO) => {
        if (editedShipment) {
            setEditedShipment({...editedShipment, [field]: value});
        }
    };

    const handleUploadFile = async (file: File) => {
        if (!id) return;
        return uploadFileMutation.mutateAsync({viazId: id, file});
    };

    const handleDragStart = (objectKey: string) => {
        setDraggedFile(objectKey);
    };

    const handleDragEnter = (index: number) => {
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedFile(null);
        setDragOverIndex(null);
    };

    const handleDrop = () => {
        setDraggedFile(null);
        setDragOverIndex(null);

        toast({
            title: "Files Reordered",
            description: "File order has been updated."
        });
    };

    const handleDeleteFile = (objectKey: string) => {
        setFileToDelete(objectKey);
    };

    const confirmDeleteFile = async () => {
        if (fileToDelete && id) {
            try {
                await deleteDocumentMutation.mutateAsync({viazId: id, objectKey: fileToDelete});
                setFileToDelete(null);
            } catch (error) {
                console.error("Error deleting file:", error);
            }
        }
    };

    // Extract file name from object key - safely handles undefined values and full paths
    const getFileNameFromObjectKey = (objectKey?: string): string => {
        if (!objectKey) return 'Unknown';
        try {
            const parts = objectKey.split('/');
            return parts[parts.length - 1] || objectKey;
        } catch (error) {
            console.error("Error extracting file name:", error);
            return objectKey;
        }
    };

    // Get file extension from object key - safely handles undefined values
    const getFileExtension = (objectKey?: string): string => {
        if (!objectKey) return 'UNKNOWN';
        try {
            const fileName = getFileNameFromObjectKey(objectKey);
            const parts = fileName.split('.');
            return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'UNKNOWN';
        } catch (error) {
            console.error("Error extracting file extension:", error);
            return 'UNKNOWN';
        }
    };

    // Guess file type from extension
    const guessFileTypeFromExtension = (objectKey: string): string => {
        const ext = getFileExtension(objectKey).toLowerCase();
        switch (ext) {
            case 'pdf':
                return 'application/pdf';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'doc':
            case 'docx':
                return 'application/msword';
            case 'xls':
            case 'xlsx':
                return 'application/vnd.ms-excel';
            case 'ppt':
            case 'pptx':
                return 'application/vnd.ms-powerpoint';
            case 'txt':
                return 'text/plain';
            case 'csv':
                return 'text/csv';
            default:
                return 'application/octet-stream';
        }
    };

    const handleViewDocument = async (objectKey: string) => {
        try {
            setIsLoadingDocument(true);
            // Pass the full objectKey to the service
            const downloadUrl = await apiShipmentService.getDocumentDownloadUrl(objectKey);
            setViewingDocument({
                objectKey,
                fileName: getFileNameFromObjectKey(objectKey),
                url: downloadUrl,
            });
        } catch (error) {
            console.error("Error fetching document URL:", error);
            toast({
                title: "Error",
                description: "Failed to load document.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingDocument(false);
        }
    };

    const handleCloseDocumentModal = () => {
        setViewingDocument(null);
    };

    const handleCloseShipment = async () => {
        if (!carrierCustomerServiceRating) {
            toast({
                title: "Error",
                description: "Ingrese la calificación final de transporte.",
                variant: "destructive",
            });

            return;
        }

        if (!carrierObservations) {
            toast({
                title: "Error",
                description: "Ingrese la observación final de transporte.",
                variant: "destructive",
            });
            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            return;
        }

        if (!clientCustomerServiceRating) {
            toast({
                title: "Error",
                description: "Ingrese la calificación final de cliente.",
                variant: "destructive",
            });

            return;
        }

        if (!clientObservations) {
            toast({
                title: "Error",
                description: "Ingrese la observación final de cliente.",
                variant: "destructive",
            });
            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            return;
        }

        try {

            const dto: ShipmentCloseRequestDTO = {
                fullViazId: shipment.fullViazId,
                carrierRating: carrierCustomerServiceRating,
                carrierObservations: carrierObservations,
                clientRating: clientCustomerServiceRating,
                clientObservations: clientObservations
            };

            await apiShipmentService.closeShipment(dto)

            toast({
                title: "Embarque Cerrado",
                description: `El embarque ha sido cerrado con calificación para transporte de: ${carrierCustomerServiceRating} y cliente de: ${clientCustomerServiceRating}.`,
            });

            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            await queryClient.invalidateQueries({queryKey: ['shipments']});
            setCloseShipmentOpen(false);
            setCarrierCustomerServiceRating(10);
            setCarrierObservations("");
            setClientCustomerServiceRating(10);
            setClientObservations("");

        } catch (error) {
            console.error("Error closing shipment:", error);
            toast({
                title: "Error",
                description: "Failed to close shipment.",
                variant: "destructive",
            });
        }
    };

    const handleAddIncident = async () => {
        if (!selectedIncidentType || !id) {
            toast({
                title: "Error",
                description: "Escoja el tipo de incidente.",
                variant: "destructive",
            });
            return;
        }

        if (!incidentComment || !id) {
            toast({
                title: "Error",
                description: "Añada la justificación del incidente",
                variant: "destructive",
            });
            return;
        }

        addIncidentMutation.mutate({viazId: id, incidentId: Number(selectedIncidentType), comment: incidentComment});
        await queryClient.invalidateQueries({queryKey: ['shipmentIncidents', id]});
        setIncidentComment("")

    };

    const handleAddCharge = async () => {
        if (!selectedChargeType || !id) {
            toast({
                title: "Error",
                description: "Escoja el tipo de cargo",
                variant: "destructive",
            });
            return;
        }

        if (!chargeComment || !id) {
            toast({
                title: "Error",
                description: "Añada la justificación del cargo",
                variant: "destructive",
            });
            return;
        }

        addChargeMutation.mutate({viazId: id, chargeId: Number(selectedChargeType), comment: chargeComment});
        await queryClient.invalidateQueries({queryKey: ['shipmentCharges', id]});

        setChargeComment("")
    };

    const filteredIncidentTypes = incidentTypes.filter(
        (incident) => incident.entityTied === selectedEntityTied
    );

    // Reopen shipment mutation
    const reopenShipmentMutation = useMutation({
        mutationFn: (viazId: string) => apiShipmentService.reopenShipment(viazId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            toast({
                title: "Exito",
                description: "Shipment has been reopened successfully.",
            });
        },
        onError: () => {
            console.error("Error reopening shipment:", error);
            toast({
                title: "Error",
                description: "Failed to reopen shipment.",
                variant: "destructive",
            });
        }
    });

    // Restore shipment mutation
    const restoreShipmentMutation = useMutation({
        mutationFn: (viazId: string) => apiShipmentService.restoreShipment(viazId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            toast({
                title: "Exito",
                description: "El embarque se ha restaurado correctamente.",
            });
        },
        onError: () => {
            console.error("Error reopening shipment:", error);
            toast({
                title: "Error",
                description: "Error al restaurar el embarque.",
                variant: "destructive",
            });
        }
    });

    const changeShipmentStatusMutation = useMutation({
        mutationFn: ({viazId, status}: { viazId: string; status: string }) =>
            apiShipmentService.changeShipmentStatus(viazId, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]}).then(() =>
                toast({
                    title: "Estatus actualizado",
                    description: `El estatus del embarque ${variables.viazId} se cambió a "${variables.status}".`,
                })
            );


        },
        onError: () => {
            toast({
                title: "Error al actualizar estatus",
                description: error.message || "Intenta de nuevo más tarde.",
                variant: "destructive",
            });
        },
    });

    const handleReopenShipment = () => {
        if (id) {
            reopenShipmentMutation.mutate(id);
            queryClient.invalidateQueries({queryKey: ['shipment', id]});

        }

    };
    const handleRestoreShipment = () => {
        if (id) {
            reopenShipmentMutation.mutate(id);
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            setIsEditing(false);
        }

    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p>Loading shipment details...</p>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="flex items-center justify-center h-96">
                <p>Error loading shipment details.</p>
            </div>
        );
    }

    const handleStatusChange = (viazId: string, status: string) => {
        changeShipmentStatusMutation.mutate({viazId, status});
    };


    return (
        <div className="space-y-6">
            {/* Show deleted shipment warning */}
            {shipment.deleted && (
                <div
                    className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trash className="h-5 w-5 text-destructive"/>
                        <div>
                            <p className="font-medium text-lg text-destructive">
                                Este embarque ha sido eliminado
                            </p>
                            <p className="text-sm text-muted-foreground">
                                No se puede editar ni visualizar detalles. Contacta al soporte si esto fue un error.
                            </p>
                        </div>
                    </div>

                    {canRestoreShipments?.() && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRestoreShipment}
                            disabled={restoreShipmentMutation.isPending}
                        >
                            <Undo className="h-4 w-4 mr-2"/>
                            {restoreShipmentMutation.isPending ? "Restaurando..." : "Restaurar Embarque"}
                        </Button>
                    )}
                </div>
            )}

            {/* Show closed shipment warning */}
            {!shipment.open && (
                <div className="bg-muted/50 border border-muted rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-lg">
                                    Este embarque ha sido cerrado con calificación de
                                </p>

                                {/* Rating Badge */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2 py-1 rounded flex items-center gap-1 cursor-help"
                                        >
                                            ⭐ {shipment.shipmentCompleteRating ?? "N/A"}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        Calificación derivada de calificaciones de cliente y embarque.
                                        Cliente
                                        ({shipment.clientCustomerServiceRating ?? "N/A"} y {shipment.clientRating ?? "N/A"}).
                                        Transporte
                                        ({shipment.carrierCustomerServiceRating ?? "N/A"} y {shipment.carrierRating ?? "N/A"}).
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {/* Show rating observation if it exists */}
                            {shipment.carrierCustomerServiceRating && (
                                <p className="mt-1 text-sm italic text-muted-foreground">
                                    Nota transporte: {shipment.carrierRatingObservation}
                                </p>
                            )}
                            {shipment.clientRatingObservation && (
                                <p className="mt-1 text-sm italic text-muted-foreground">
                                    Nota cliente: {shipment.clientRatingObservation}
                                </p>
                            )}

                            <p className="text-sm text-muted-foreground">
                                Este embarque ha sido cerrado y solo se puede leer
                            </p>
                        </div>
                    </div>


                    {canCloseShipments() && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReopenShipment}
                            disabled={reopenShipmentMutation.isPending}
                        >
                            <Unlock className="h-4 w-4 mr-2"/>
                            {reopenShipmentMutation.isPending ? "Reabriendo..." : "Reabrir Embarque"}
                        </Button>
                    )}
                </div>

            )}

            <div className="flex items-center flex-wrap gap-2">
                <Button variant="ghost" onClick={handleBack} className="mr-2">
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Regresar
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{shipment.fullViazId}</h1>
                <div className="ml-auto flex gap-2">
                    {shipmentAvailableToInteract && canCreateShipments() && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setAddIncidentOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <AlertTriangle className="h-4 w-4"/>
                                Incidente
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setChargeDialogOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <DollarSign className="h-4 w-4"/>
                                Cargo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCloseShipmentOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Lock className="h-4 w-4"/>
                                Cerrar
                            </Button>
                            {shipment.baseViazId === shipment.fullViazId && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShipmentToCreateVariant(shipment.fullViazId)}
                                        disabled={createVariantMutation.isPending}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4"/>
                                        {createVariantMutation.isPending ? "Creando..." : "Crear Variante"}
                                    </Button>
                                    <AlertDialog
                                        open={!!shipmentToCreateVariant}
                                        onOpenChange={(open) => {
                                            if (!open) setShipmentToCreateVariant(null);
                                        }}
                                    >
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Crear Variante</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    ¿Quieres hacer una variante del embarque: {shipment.fullViazId}?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        if (shipmentToCreateVariant) {
                                                            createVariantMutation.mutate(shipmentToCreateVariant);
                                                            setShipmentToCreateVariant(null);
                                                        }
                                                    }}
                                                >
                                                    Crear Variante
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </>
                    )}

                    {canDeleteShipments() && isEditing && (<>
                            <Button
                                className="text-destructive focus:text-destructive"
                                variant="outline"
                                size="sm"
                                onClick={() => setShipmentToDelete(shipment.fullViazId)}
                            >
                                <Trash/> Borrar
                            </Button>
                            {/* Delete Confirmation Dialog */
                            }
                            <AlertDialog open={!!shipmentToDelete}
                                         onOpenChange={(open) => !open && setShipmentToDelete(null)}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Eliminar Embarque</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            ¿Estas seguro de querer eliminar este embarque? Esta acción no se puede
                                            deshacer.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                if (shipmentToDelete) {
                                                    deleteShipmentMutation.mutate(shipmentToDelete);
                                                    setShipmentToDelete(null);
                                                }
                                            }}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </>
                    )}
                    {shipmentAvailableToInteract && canCreateShipments() && (
                        !isEditing ? (
                            <Button
                                onClick={handleEdit}
                                disabled={updateShipmentMutation.isPending}
                            >
                                <Edit className="h-4 w-4 mr-2"/>
                                Editar
                            </Button>
                        ) : (
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={updateShipmentMutation.isPending}
                                >
                                    <X className="h-4 w-4 mr-2"/>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateShipmentMutation.isPending}
                                >
                                    <Save className="h-4 w-4 mr-2"/>
                                    {updateShipmentMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <ShipmentDetailForm
                        shipment={shipment}
                        isEditing={isEditing && shipmentAvailableToInteract}
                        editedShipment={editedShipment || shipment}
                        handleInputChange={handleInputChange}
                        getStatusColor={getStatusColor}
                        transports={carriers}
                        customerServiceAgents={customerServiceAgents}
                        clients={clients}
                        isLoadingTransports={isLoadingTransports}
                        isLoadingCustomerServiceAgents={isLoadingCustomerServiceAgents}
                        isLoadingClients={isLoadingClients}
                        handleStatusChange={handleStatusChange}
                    />


                    {/*/!* Reschedule Card *!/*/}
                    {/*/!*Deprecated*!/*/}
                    {/*<ShipmentRescheduleCard shipment={shipment}/>*/}


                    {/* Variants Section */}
                    {(shipment.hasVariants || /[a-zA-Z]$/.test(id)) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Variantes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {shipment.hasVariants ? (
                                    isLoadingVariants ? (
                                        <p className="text-muted-foreground">Cargando variantes...</p>
                                    ) : variants.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {variants.map((variant) => (
                                                <Button
                                                    key={variant}
                                                    variant="outline"
                                                    onClick={() => navigate(`/shipments/${variant}`)}
                                                    className="justify-start"
                                                >
                                                    {variant}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No hay variantes disponibles.</p>
                                    )
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/shipments/${shipment.baseViazId}`)}
                                    >
                                        Ir a embarque base: {shipment.baseViazId}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}


                </div>
                <div className="space-y-6">
                    <ShipmentFilesCard
                        viazId={id || ''}
                        isEditing={isEditing && shipmentAvailableToInteract}
                        documents={documents}
                        isLoadingDocuments={isLoadingDocuments}
                        handleDeleteFile={handleDeleteFile}
                        handleViewDocument={handleViewDocument}
                        getFileNameFromObjectKey={getFileNameFromObjectKey}
                        getFileExtension={getFileExtension}
                        guessFileTypeFromExtension={guessFileTypeFromExtension}
                        isLoadingDocument={isLoadingDocument}
                        handleUploadFile={handleUploadFile}
                        refetchDocuments={refetchDocuments}
                        isUploading={uploadFileMutation.isPending}
                        handleDragStart={handleDragStart}
                        handleDragEnter={handleDragEnter}
                        handleDragEnd={handleDragEnd}
                        handleDrop={handleDrop}
                        dragOverIndex={dragOverIndex}
                    />
                    <ShipmentIncidentsChargesCard
                        incidents={shipmentIncidents}
                        charges={shipmentCharges}
                        isLoading={isLoadingCharges || isLoadingIncidents}
                        error={chargesError?.message || incidentsError?.message}
                        shipmentId={id}
                    />

                </div>
            </div>


            {/* Delete File Confirmation Dialog */}
            <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this file? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteFile}
                                           className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Document Viewer Dialog */}
            <DocumentViewer
                viewingDocument={viewingDocument}
                handleCloseDocumentModal={handleCloseDocumentModal}
                guessFileTypeFromExtension={guessFileTypeFromExtension}
            />

            {/* Close Shipment Dialog */}
            <Dialog open={closeShipmentOpen} onOpenChange={setCloseShipmentOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cerrar Embarque</DialogTitle>
                        <DialogDescription>
                            Ingrese una calificación para el embarque antes de cerrarlo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="carrierRating">Calificación del Transporte</Label>
                            <Input
                                id="carrierRating"
                                type="number"
                                value={carrierCustomerServiceRating}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value > 10) {
                                        setCarrierCustomerServiceRating(10);
                                    } else if (value < 0) {
                                        setCarrierCustomerServiceRating(0);
                                    } else {
                                        setCarrierCustomerServiceRating(value);
                                    }
                                }}
                                min={0}
                                max={10}
                                className="text-center"
                            />


                            <Input
                                id="carrierRating-Observations"
                                placeholder="Ingrese la observación final de transporte."
                                value={carrierObservations}
                                onChange={(e) => setCarrierObservations(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="clientRating">Calificación del Cliente</Label>
                            <Input
                                id="clientRating"
                                type="number"
                                value={clientCustomerServiceRating}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value > 10) {
                                        setClientCustomerServiceRating(10);
                                    } else if (value < 0) {
                                        setClientCustomerServiceRating(0);
                                    } else {
                                        setClientCustomerServiceRating(value);
                                    }
                                }}
                                min={0}
                                max={10}
                                className="text-center"
                            />


                            <Input
                                id="clientRating-Observations"
                                placeholder="Ingrese la observación final del cliente."
                                value={clientObservations}
                                onChange={(e) => setClientObservations(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCloseShipmentOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCloseShipment}>
                            Cerrar Embarque
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Incident Dialog */}
            <Dialog open={addIncidentOpen} onOpenChange={setAddIncidentOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Incidente</DialogTitle>
                        <DialogDescription>
                            Selecciona el tipo de incidente y a quién se le atribuye.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            {/* Entity Type Select */}
                            <Label htmlFor="entity-type">Atribuir a</Label>
                            <Select
                                value={selectedEntityTied}
                                onValueChange={(value) => {
                                    setSelectedEntityTied(value);
                                    setSelectedIncidentType(""); // Reset selected incident when entity changes
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona hacia quien es el incidente"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CARRIER">Transporte</SelectItem>
                                    <SelectItem value="CLIENT">Cliente</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Incident Type Select */}
                            <Label htmlFor="incident-type">Tipo de Incidente</Label>
                            <Select
                                value={selectedIncidentType}
                                onValueChange={setSelectedIncidentType}
                                disabled={filteredIncidentTypes.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo de incidente"/>
                                </SelectTrigger>
                                <SelectContent searchable={true}>
                                    {isLoadingIncidentTypes ? (
                                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                                    ) : (
                                        filteredIncidentTypes.map((incident) => (
                                            <SelectItem
                                                key={incident.incidentId}
                                                value={incident.incidentId.toString()}
                                            >
                                                {incident.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>

                            {/* Comment Input */}
                            <Label htmlFor="incident-comment">Justificación</Label>
                            <Input
                                id="incidentObservations"
                                placeholder="Comentario del incidente."
                                value={incidentComment}
                                onChange={(e) => setIncidentComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddIncidentOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddIncident}
                            disabled={addIncidentMutation.isPending || !selectedIncidentType}
                        >
                            {addIncidentMutation.isPending ? "Agregando..." : "Agregar Incidente"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Charge Dialog */}
            <Dialog open={chargeDialogOpen} onOpenChange={setChargeDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Cargo</DialogTitle>
                        <DialogDescription>
                            Selecciona el tipo de cargo a agregar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="charge-type">Tipo de cargo a Transporte</Label>
                            <Select value={selectedChargeType} onValueChange={setSelectedChargeType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo de cargo"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingChargeTypes ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : (
                                        chargeTypes.map((charge) => (
                                            <SelectItem key={charge.chargeId} value={charge.chargeId.toString()}>
                                                {charge.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <Label htmlFor="charge-observations">Justificación</Label>
                            <Input
                                id="chargeObservations"
                                placeholder="Comentario del cargo."
                                value={chargeComment}
                                onChange={(e) => setChargeComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setChargeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCharge}
                            disabled={addChargeMutation.isPending || !selectedChargeType}
                        >
                            {addChargeMutation.isPending ? "Adding..." : "Add Charge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShipmentDetail;