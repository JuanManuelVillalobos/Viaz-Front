import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ArrowLeft, Edit, Save, X, Lock, Clock, AlertTriangle, Unlock, DollarSign} from "lucide-react";
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
import {apiShipmentService, incidentService, chargeService} from '@/services/api';
import {getStatusColor} from "@/services/shipmentService";
import {usePermissions} from '@/hooks/usePermissions';

import {ShipmentDetailForm} from "@/components/shipment/ShipmentDetailForm";
import {ShipmentFilesCard} from "@/components/shipment/ShipmentFilesCard";
import {DocumentViewer} from "@/components/shipment/DocumentViewer";
import {Shipment, ShipmentRequest, Transport} from "@/types/shipment";
import {UserSummaryDTO} from "@/types/api.ts";
import {ShipmentIncidentsChargesCard} from "@/components/shipment/ShipmentIncidentsChargesCard.tsx";

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
    const [shipmentGrade, setShipmentGrade] = useState(10);
    const [shipmentObservations, setShipmentObservations] = useState("");
    const [chargeComment, setChargeComment] = useState("");
    const [incidentComment, setIncidentComment] = useState("");
    const [addIncidentOpen, setAddIncidentOpen] = useState(false);
    const [selectedIncidentType, setSelectedIncidentType] = useState<string>("");
    const [selectedChargeType, setSelectedChargeType] = useState<string>("");
    const [chargeDialogOpen, setChargeDialogOpen] = useState(false);
    const {canCloseShipments, canCreateShipments} = usePermissions();

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

    // Fetch available transports
    const {data: transports = [], isLoading: isLoadingTransports} = useQuery<Transport[]>({
        queryKey: ['transports'],
        queryFn: apiShipmentService.getTransports,
        enabled: isEditing, // Only fetch when in editing mode
    });

    // Fetch available customer service agents
    const {data: customerServiceAgents = [], isLoading: isLoadingCustomerServiceAgents} = useQuery<UserSummaryDTO[]>({
        queryKey: ['customerServiceAgents'],
        queryFn: apiShipmentService.getCustomerServiceAgents,
        enabled: isEditing, // Only fetch when in editing mode
    });

    // Fetch ETA for shipment
    const {data: eta, isLoading: isLoadingEta} = useQuery({
        queryKey: ['shipmentEta', id],
        queryFn: () => id ? apiShipmentService.getShipmentEta(id) : Promise.reject('No ID provided'),
        enabled: !!id
    });

    // Fetch incident types
    const {data: incidentTypes = [], isLoading: isLoadingIncidentTypes} = useQuery({
        queryKey: ['incidentTypes'],
        queryFn: incidentService.getAllIncidentTypes,
        enabled: addIncidentOpen
    });

    // Fetch charge types
    const {data: chargeTypes = [], isLoading: isLoadingChargeTypes} = useQuery({
        queryKey: ['chargeTypes'],
        queryFn: chargeService.getAllChargeTypes,
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


    // Update shipment mutation
    const updateShipmentMutation = useMutation({
        mutationFn: ({id, updates}: { id: string, updates: Partial<ShipmentRequest> }) =>
            apiShipmentService.updateShipment(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            setIsEditing(false);
            toast({
                title: "Success",
                description: "Shipment details updated successfully.",
            });
        },
        onError: (error) => {
            console.error("Error updating shipment:", error);
            toast({
                title: "Error",
                description: "Failed to update shipment details.",
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
                title: "Success",
                description: "File uploaded successfully.",
            });
        },
        onError: (error) => {
            console.error("Error uploading file:", error);
            toast({
                title: "Error",
                description: "Failed to upload file.",
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
                title: "Success",
                description: "File deleted successfully.",
            });
        },
        onError: (error) => {
            console.error("Error deleting document:", error);
            toast({
                title: "Error",
                description: "Failed to delete file.",
                variant: "destructive",
            });
        }
    });

    // Add incident mutation
    const addIncidentMutation = useMutation({
        mutationFn: ({viazId, incidentId, comment}: { viazId: string, incidentId: string, comment: string }) =>
            incidentService.addIncidentToShipment(viazId, incidentId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipmentIncidents', id]});
            setAddIncidentOpen(false);
            setSelectedIncidentType("");
            toast({
                title: "Success",
                description: "Incident added to shipment successfully.",
            });
        },
        onError: (error) => {
            console.error("Error adding incident:", error);
            toast({
                title: "Error",
                description: "Failed to add incident to shipment.",
                variant: "destructive",
            });
        }
    });

    // Add charge mutation
    const addChargeMutation = useMutation({
        mutationFn: ({viazId, chargeId, comment}: { viazId: string, chargeId: string, comment: string }) =>
            chargeService.addChargeToShipment(viazId, chargeId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipmentCharges', id]});
            setChargeDialogOpen(false);
            setSelectedChargeType("");
            toast({
                title: "Success",
                description: "Charge added to shipment successfully.",
            });
        },
        onError: (error) => {
            console.error("Error adding charge:", error);
            toast({
                title: "Error",
                description: "Failed to add charge to shipment.",
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
            const {files, ...rest} = editedShipment;
            const updates: Partial<ShipmentRequest> = {
                ...rest,
                transport: editedShipment.transport ? editedShipment.transport.name : undefined,
                customerServiceAgent: editedShipment.customerServiceAgent ? editedShipment.customerServiceAgent.username : undefined,
            };
            updateShipmentMutation.mutate({id, updates});
        }
    };


    const handleInputChange = (field: keyof Shipment, value: string | boolean | number | Transport | UserSummaryDTO) => {
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

    const handleDrop = (targetIndex: number) => {
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
        if (!shipmentGrade) {
            toast({
                title: "Error",
                description: "Ingrese la calificación final.",
                variant: "destructive",
            });

            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            return;
        }

        if (!shipmentObservations) {
            toast({
                title: "Error",
                description: "Ingrese la observación final.",
                variant: "destructive",
            });
            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            return;
        }

        try {

            await apiShipmentService.closeShipment(shipment.viazId, shipmentGrade, shipmentObservations)

            toast({
                title: "Embarque Cerrado",
                description: `El embarque ha sido cerrado con calificación: ${shipmentGrade}`,
            });

            await queryClient.invalidateQueries({queryKey: ['shipment', id]});
            setCloseShipmentOpen(false);
            setShipmentGrade(10);
            setShipmentObservations("");
        } catch (error) {
            console.error("Error closing shipment:", error);
            toast({
                title: "Error",
                description: "Failed to close shipment.",
                variant: "destructive",
            });
        }
    };

    // Format ETA from seconds to readable format
    const formatEta = (seconds: number): string => {
        if (seconds < 60) {
            return `${seconds} seconds`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            if (minutes === 0) {
                return `${hours} hour${hours !== 1 ? 's' : ''}`;
            }
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    };

    const handleAddIncident = async () => {
        if (!selectedIncidentType || !id) {
            toast({
                title: "Error",
                description: "Please select an incident type.",
                variant: "destructive",
            });
            return;
        }

        addIncidentMutation.mutate({viazId: id, incidentId: selectedIncidentType, comment: incidentComment});
        await queryClient.invalidateQueries({queryKey: ['shipmentIncidents', id]});
        setIncidentComment("")

    };

    const handleAddCharge = async () => {
        if (!selectedChargeType || !id) {
            toast({
                title: "Error",
                description: "Please select a charge type.",
                variant: "destructive",
            });
            return;
        }

        addChargeMutation.mutate({viazId: id, chargeId: selectedChargeType, comment: chargeComment});
        await queryClient.invalidateQueries({queryKey: ['shipmentCharges', id]});

        setChargeComment("")
    };

    // Reopen shipment mutation
    const reopenShipmentMutation = useMutation({
        mutationFn: (viazId: string) => apiShipmentService.reopenShipment(viazId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipment', id]});
            toast({
                title: "Success",
                description: "Shipment has been reopened successfully.",
            });
        },
        onError: (error) => {
            console.error("Error reopening shipment:", error);
            toast({
                title: "Error",
                description: "Failed to reopen shipment.",
                variant: "destructive",
            });
        }
    });

    const handleReopenShipment = () => {
        if (id) {
            reopenShipmentMutation.mutate(id);
            queryClient.invalidateQueries({queryKey: ['shipment', id]});

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

    return (
        <div className="space-y-6">
            {/* Show closed shipment warning */}
            {!shipment.open && (
                <div className="bg-muted/50 border border-muted rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-lg">Este embarque ha sido cerrado con calificación de </p>

                                {/* Rating Badge */}
                                <div
                                    className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2 py-1 rounded flex items-center gap-1">
                                    ⭐ {shipment.rating ?? "N/A"}
                                </div>
                            </div>

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{shipment.viazId}</h1>
                <div className="ml-auto flex gap-2">
                    {shipment.open && canCreateShipments() && (
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
                        </>
                    )}
                    {shipment.open && canCreateShipments() && (
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
                        isEditing={isEditing && shipment.open}
                        editedShipment={editedShipment || shipment}
                        handleInputChange={handleInputChange}
                        getStatusColor={getStatusColor}
                        transports={transports}
                        customerServiceAgents={customerServiceAgents}
                        isLoadingTransports={isLoadingTransports}
                        isLoadingCustomerServiceAgents={isLoadingCustomerServiceAgents}
                    />

                    {/* ETA Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5"/>
                                Tiempo estimado de entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingEta ? (
                                <p className="text-muted-foreground">Loading ETA...</p>
                            ) : eta !== undefined ? (
                                <p className="text-lg font-semibold">{formatEta(eta)}</p>
                            ) : (
                                <p className="text-muted-foreground">ETA not available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">


                    <ShipmentFilesCard
                        viazId={id || ''}
                        isEditing={isEditing && shipment.open}
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
                            <Label htmlFor="grade">Calificación del Embarque</Label>
                            <Input
                                id="grade"
                                type="number"
                                value={shipmentGrade}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value > 10) {
                                        setShipmentGrade(10);
                                    } else if (value < 0) {
                                        setShipmentGrade(0);
                                    } else {
                                        setShipmentGrade(value);
                                    }
                                }}
                                min={0}
                                max={10}
                                className="text-center"
                            />


                            <Input
                                id="Observations"
                                placeholder="Ingrese la observación final."
                                value={shipmentObservations}
                                onChange={(e) => setShipmentObservations(e.target.value)}
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
                            Select an incident type to add to this shipment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="incident-type">Incident Type</Label>
                            <Select value={selectedIncidentType} onValueChange={setSelectedIncidentType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select incident type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingIncidentTypes ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : (
                                        incidentTypes.map((incident) => (
                                            <SelectItem key={incident.incidentId} value={incident.incidentId}>
                                                {incident.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
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
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddIncident}
                            disabled={addIncidentMutation.isPending || !selectedIncidentType}
                        >
                            {addIncidentMutation.isPending ? "Adding..." : "Add Incident"}
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
                            <Label htmlFor="charge-type">Charge Type</Label>
                            <Select value={selectedChargeType} onValueChange={setSelectedChargeType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select charge type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingChargeTypes ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : (
                                        chargeTypes.map((charge) => (
                                            <SelectItem key={charge.chargeId} value={charge.chargeId}>
                                                {charge.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
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
