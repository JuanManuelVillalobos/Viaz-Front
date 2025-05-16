
import { useState, useRef } from "react";
import { 
  FileText, File, Upload, Download, 
  Eye, Trash2, GripVertical 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShipmentFile } from "@/types/api";

interface ShipmentFilesCardProps {
  isEditing: boolean;
  documents: string[];
  isLoadingDocuments: boolean;
  handleAddFile: () => void;
  handleDeleteFile: (objectKey: string) => void;
  handleViewDocument: (objectKey: string) => void;
  getFileNameFromObjectKey: (objectKey?: string) => string;
  getFileExtension: (objectKey?: string) => string;
  guessFileTypeFromExtension: (objectKey: string) => string;
  isLoadingDocument: boolean;
  isDraggingOver: boolean;
  setIsDraggingOver: (value: boolean) => void;
  handleFileDrop: (event: React.DragEvent) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleDragLeave: () => void;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newFile: Partial<ShipmentFile>;
  setNewFile: (file: Partial<ShipmentFile>) => void;
  isAddingFile: boolean;
  setIsAddingFile: (value: boolean) => void;
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
  handleAddFile,
  handleDeleteFile,
  handleViewDocument,
  getFileNameFromObjectKey,
  getFileExtension,
  guessFileTypeFromExtension,
  isLoadingDocument,
  isDraggingOver,
  setIsDraggingOver,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  triggerFileInput,
  fileInputRef,
  handleFileInputChange,
  newFile,
  setNewFile,
  isAddingFile,
  setIsAddingFile,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  handleDrop,
  dragOverIndex
}: ShipmentFilesCardProps) => {
  return (
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
                <Upload className="h-4 w-4 mr-2" />
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
                      {newFile.size ? `${(newFile.size / (1024)).toFixed(1)} KB` : ''}
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
                    <TableHead className="w-[30%]">Object Key</TableHead>
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
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-muted-foreground" />
                          {getFileNameFromObjectKey(objectKey)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getFileExtension(objectKey)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono truncate">
                        {objectKey}
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
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFile(objectKey)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
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
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files attached to this shipment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
