import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ArrowLeft, Edit, Save, X} from "lucide-react";
import {Button} from "@/components/ui/button";
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
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService} from "@/services/api/apiShipmentService.ts";
import {getStatusColor} from "@/services/shipmentService";

import {ShipmentDetailForm} from "@/components/shipment/ShipmentDetailForm";
import {ShipmentFilesCard} from "@/components/shipment/ShipmentFilesCard";
import {DocumentViewer} from "@/components/shipment/DocumentViewer";
import {Shipment, ShipmentRequest} from "@/types/shipment";

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
            const updates: Partial<ShipmentRequest> = {
                ...editedShipment,
                transport: editedShipment.transport ? editedShipment.transport.name : undefined,
            };
            updateShipmentMutation.mutate({id, updates});
        }
    };


    const handleInputChange = (field: keyof Shipment, value: string | boolean | number) => {
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
            <div className="flex items-center flex-wrap gap-2">
                <Button variant="ghost" onClick={handleBack} className="mr-2">
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back to Shipments
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{shipment.viazId}</h1>
                {!isEditing ? (
                    <Button
                        onClick={handleEdit}
                        className="ml-auto"
                        disabled={updateShipmentMutation.isPending}
                    >
                        <Edit className="h-4 w-4 mr-2"/>
                        Edit Shipment
                    </Button>
                ) : (
                    <div className="ml-auto space-x-2">
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
                            {updateShipmentMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ShipmentDetailForm
                    shipment={shipment}
                    isEditing={isEditing}
                    editedShipment={editedShipment || shipment}
                    handleInputChange={handleInputChange}
                    getStatusColor={getStatusColor}
                />

                <ShipmentFilesCard
                    viazId={id || ''}
                    isEditing={isEditing}
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
        </div>
    );
};

export default ShipmentDetail;
