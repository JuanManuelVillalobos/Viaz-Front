
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Package, ArrowLeft, Edit, Save, X, Plus,
  FileText, File, Calendar, Truck, MapPin, User,
  GripVertical, Trash2, Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shipment, ShipmentFile } from "@/types/shipment";
import { getShipmentById, updateShipment, getStatusColor } from "@/services/shipmentService";

const ShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipment, setEditedShipment] = useState<Shipment | null>(null);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFile, setNewFile] = useState<Partial<ShipmentFile>>({
    name: "",
    type: "application/pdf",
    size: 0,
  });
  const [draggedFile, setDraggedFile] = useState<ShipmentFile | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [fileToDelete, setFileToDelete] = useState<ShipmentFile | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (id) {
      const shipmentData = getShipmentById(id);
      if (shipmentData) {
        if (shipmentData.files) {
          shipmentData.files = shipmentData.files.map((file, index) => ({
            ...file,
            position: file.position !== undefined ? file.position : index
          }));
          shipmentData.files.sort((a, b) => (a.position || 0) - (b.position || 0));
        }
        setShipment(shipmentData);
        setEditedShipment({ ...shipmentData });
      } else {
        toast({
          title: "Error",
          description: `Shipment with ID ${id} not found.`,
          variant: "destructive",
        });
        navigate("/shipments");
      }
    }
  }, [id, navigate]);
  
  const handleBack = () => {
    navigate("/shipments");
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    if (shipment) {
      setEditedShipment({ ...shipment });
    }
  };
  
  const handleSave = () => {
    if (editedShipment) {
      const updated = updateShipment(editedShipment);
      setShipment(updated);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Shipment details updated successfully.",
      });
    }
  };
  
  const handleInputChange = (field: keyof Shipment, value: string) => {
    if (editedShipment) {
      setEditedShipment({ ...editedShipment, [field]: value });
    }
  };
  
  const handleAddFile = () => {
    if (editedShipment && newFile.name) {
      const filesCount = editedShipment.files ? editedShipment.files.length : 0;
      const fileToAdd: ShipmentFile = {
        id: `file-${Date.now()}`,
        name: newFile.name,
        type: newFile.type || "application/pdf",
        size: newFile.size || 1024,
        uploadDate: new Date().toISOString().split('T')[0],
        position: filesCount
      };
      
      const updatedFiles = editedShipment.files ? [...editedShipment.files, fileToAdd] : [fileToAdd];
      const updatedShipment = { ...editedShipment, files: updatedFiles };
      
      setEditedShipment(updatedShipment);
      setShipment(updateShipment(updatedShipment));
      
      setNewFile({
        name: "",
        type: "application/pdf",
        size: 0,
      });
      
      setIsAddingFile(false);
      
      toast({
        title: "Success",
        description: `File "${fileToAdd.name}" added successfully.`,
      });
    }
  };
  
  const handleDragStart = (file: ShipmentFile) => {
    setDraggedFile(file);
  };
  
  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedFile(null);
    setDragOverIndex(null);
  };
  
  const handleDrop = (targetIndex: number) => {
    if (!draggedFile || !editedShipment || !editedShipment.files) return;
    
    const sourceIndex = editedShipment.files.findIndex(file => file.id === draggedFile.id);
    if (sourceIndex === -1) return;
    
    const updatedFiles = [...editedShipment.files];
    
    const [removedFile] = updatedFiles.splice(sourceIndex, 1);
    
    updatedFiles.splice(targetIndex, 0, removedFile);
    
    const reorderedFiles = updatedFiles.map((file, index) => ({
      ...file,
      position: index
    }));
    
    const updatedShipment = { ...editedShipment, files: reorderedFiles };
    setEditedShipment(updatedShipment);
    setShipment(updateShipment(updatedShipment));
    
    setDraggedFile(null);
    setDragOverIndex(null);
    
    toast({
      title: "Files Reordered",
      description: "File order has been updated."
    });
  };
  
  const handleDeleteFile = (file: ShipmentFile) => {
    setFileToDelete(file);
  };
  
  const confirmDeleteFile = () => {
    if (fileToDelete && editedShipment && editedShipment.files) {
      const updatedFiles = editedShipment.files.filter(f => f.id !== fileToDelete.id);
      
      // Reindex positions
      const reorderedFiles = updatedFiles.map((file, index) => ({
        ...file,
        position: index
      }));
      
      const updatedShipment = { ...editedShipment, files: reorderedFiles };
      setEditedShipment(updatedShipment);
      setShipment(updateShipment(updatedShipment));
      
      setFileToDelete(null);
      
      toast({
        title: "File Deleted",
        description: `File "${fileToDelete.name}" has been removed.`
      });
    }
  };
  
  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setNewFile({
        name: droppedFile.name,
        type: droppedFile.type || "application/octet-stream",
        size: droppedFile.size,
      });
    }
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setNewFile({
        name: selectedFile.name,
        type: selectedFile.type || "application/octet-stream",
        size: selectedFile.size,
      });
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  if (!shipment || !editedShipment) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading shipment details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap gap-2">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{shipment.id}</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} className="ml-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Shipment
          </Button>
        ) : (
          <div className="ml-auto space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input 
                        id="origin" 
                        value={editedShipment.origin}
                        onChange={(e) => handleInputChange("origin", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input 
                        id="destination" 
                        value={editedShipment.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="customer" 
                      value={editedShipment.customer}
                      onChange={(e) => handleInputChange("customer", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="carrier" 
                      value={editedShipment.carrier}
                      onChange={(e) => handleInputChange("carrier", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="date" 
                      value={editedShipment.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedShipment.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origin</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-base">{shipment.origin}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Destination</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-base">{shipment.destination}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.customer}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carrier</p>
                  <div className="flex items-center mt-1">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.carrier}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{shipment.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Files
              </div>
              <Dialog open={isAddingFile} onOpenChange={setIsAddingFile}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add File
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New File</DialogTitle>
                    <DialogDescription>
                      Add file details to this shipment.
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
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
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
                    
                    {newFile.name && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{newFile.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(newFile.size || 0)}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="filetype">File Type</Label>
                      <Select
                        value={newFile.type}
                        onValueChange={(value) => setNewFile({...newFile, type: value})}
                      >
                        <SelectTrigger id="filetype">
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="application/pdf">PDF Document (.pdf)</SelectItem>
                          <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel Spreadsheet (.xlsx)</SelectItem>
                          <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document (.docx)</SelectItem>
                          <SelectItem value="image/jpeg">JPEG Image (.jpg)</SelectItem>
                          <SelectItem value="image/png">PNG Image (.png)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingFile(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFile} disabled={!newFile.name}>Add File</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(shipment?.files && shipment.files.length > 0) ? (
              <ScrollArea className="h-[300px]">
                <div className="w-full min-w-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[5%]"></TableHead>
                        <TableHead className="w-[35%]">Name</TableHead>
                        <TableHead className="w-[20%]">Type</TableHead>
                        <TableHead className="w-[15%]">Size</TableHead>
                        <TableHead className="w-[15%]">Upload Date</TableHead>
                        {isEditing && <TableHead className="w-[10%]">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipment.files.map((file, index) => (
                        <TableRow 
                          key={file.id}
                          draggable
                          onDragStart={() => handleDragStart(file)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnd={handleDragEnd}
                          onDrop={() => handleDrop(index)}
                          className={`cursor-move ${dragOverIndex === index ? 'bg-muted/80 border-dashed border-2 border-primary/50' : ''}`}
                        >
                          <TableCell className="py-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-muted-foreground" />
                              {file.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {file.type.split('/')[1].toUpperCase()}
                          </TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>{file.uploadDate}</TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFile(file)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No files attached to this shipment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
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
            <AlertDialogAction onClick={confirmDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShipmentDetail;
