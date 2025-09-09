import {useState, useRef} from "react";
import {
    FileText, File, Upload, Trash2, GripVertical, X, Eye
} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toast} from "@/hooks/use-toast";

interface ShipmentFilesCardProps {
    viazId: string; // Add the ID to use for upload
    isEditing: boolean;
    documents: string[];
    isLoadingDocuments: boolean;
    handleViewDocument: (objectKey: string) => void;
    handleDeleteFile: (objectKey: string) => void;
    getFileNameFromObjectKey: (objectKey?: string) => string;
    getFileExtension: (objectKey?: string) => string;
    guessFileTypeFromExtension: (objectKey: string) => string;
    isLoadingDocument: boolean;
    handleUploadFile: (file: File) => Promise<void>;
    refetchDocuments: () => void;
    isUploading: boolean;
    handleDragStart: (objectKey: string) => void;
    handleDragEnter: (index: number) => void;
    handleDragEnd: () => void;
    handleDrop: (targetIndex: number) => void;
    dragOverIndex: number | null;
}

export const ShipmentFilesCard = ({
                                      isEditing,
                                      documents,
                                      isLoadingDocuments,
                                      handleViewDocument,
                                      handleDeleteFile,
                                      getFileNameFromObjectKey,
                                      getFileExtension,
                                      isLoadingDocument,
                                      handleUploadFile,
                                      refetchDocuments,
                                      isUploading,
                                      handleDragStart,
                                      handleDragEnter,
                                      handleDragEnd,
                                      handleDrop,
                                      dragOverIndex
                                  }: ShipmentFilesCardProps) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleFileDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDraggingOver(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleAddFile = async () => {
        if (!selectedFile) return;

        try {
            await handleUploadFile(selectedFile);
            setSelectedFile(null);
            setIsAddingFile(false);
            refetchDocuments();
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading the file.",
                variant: "destructive",
            });
        }
    };
  
    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5"/>
                        Documentos
                    </div>
                    {isEditing && (
                        <Dialog open={isAddingFile} onOpenChange={setIsAddingFile}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Upload className="h-4 w-4 mr-2"/>
                                    Add File
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload File</DialogTitle>
                                    <DialogDescription>
                                        Upload a file to this shipment.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div
                                        className={`grid gap-2 border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                                            isDraggingOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                        }`}
                                        onClick={triggerFileInput}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleFileDrop}
                                    >
                                        <Upload className="h-10 w-10 mx-auto text-muted-foreground"/>
                                        <p className="text-sm font-medium">
                                            {isDraggingOver ? "Drop file here" : "Drag & drop file or click to browse"}
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileInputChange}
                                        />
                                    </div>

                                    {selectedFile && (
                                        <div className="bg-muted/50 p-3 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <File className="h-4 w-4 text-muted-foreground"/>
                                                    <span className="font-medium">{selectedFile.name}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={clearSelectedFile}
                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {selectedFile ? `${(selectedFile.size / (1024)).toFixed(1)} KB` : ''}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddingFile(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddFile}
                                        disabled={!selectedFile || isUploading}
                                    >
                                        {isUploading ? "Uploading..." : "Upload File"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoadingDocuments ? (
                    <div className="flex items-center justify-center h-48">
                        <p>Loading documents...</p>
                    </div>
                ) : documents.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                        <div className="w-full min-w-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[5%]"></TableHead>
                                        <TableHead className="w-[35%]">Name</TableHead>
                                        <TableHead className="w-[20%]">Type</TableHead>
                                        <TableHead className="w-[10%]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((objectKey, index) => (
                                        <TableRow
                                            key={objectKey}
                                            draggable
                                            onDragStart={() => handleDragStart(objectKey)}
                                            onDragEnter={() => handleDragEnter(index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragEnd={handleDragEnd}
                                            onDrop={() => handleDrop(index)}
                                            className={`cursor-move ${dragOverIndex === index ? 'bg-muted/80 border-dashed border-2 border-primary/50' : ''}`}
                                        >
                                            <TableCell className="py-2">
                                                <GripVertical className="h-4 w-4 text-muted-foreground"/>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <File className="h-4 w-4 mr-2 text-muted-foreground"/>
                                                    {getFileNameFromObjectKey(objectKey)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getFileExtension(objectKey)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewDocument(objectKey)}
                                                        className="h-8 w-8 hover:bg-primary/10"
                                                        disabled={isLoadingDocument}
                                                    >
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                    {isEditing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteFile(objectKey)}
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4"/>
                        <p className="text-muted-foreground">Este embarque no tiene documentos agregados</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
