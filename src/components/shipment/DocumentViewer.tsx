
import { File, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocumentViewerProps {
  viewingDocument: {
    objectKey: string;
    fileName: string;
    url: string;
  } | null;
  handleCloseDocumentModal: () => void;
  guessFileTypeFromExtension: (objectKey: string) => string;
}

export const DocumentViewer = ({
  viewingDocument,
  handleCloseDocumentModal,
  guessFileTypeFromExtension
}: DocumentViewerProps) => {
  if (!viewingDocument) return null;
  
  return (
    <Dialog open={!!viewingDocument} onOpenChange={() => handleCloseDocumentModal()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {viewingDocument?.fileName || 'Document'}
          </DialogTitle>
          <DialogDescription>
            Object key: {viewingDocument?.objectKey}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden my-4">
          {guessFileTypeFromExtension(viewingDocument.objectKey).includes('pdf') ? (
            <iframe 
              src={viewingDocument.url} 
              className="w-full h-[60vh] border rounded"
              title={viewingDocument.fileName}
            />
          ) : guessFileTypeFromExtension(viewingDocument.objectKey).includes('image') ? (
            <img 
              src={viewingDocument.url} 
              alt={viewingDocument.fileName}
              className="max-w-full max-h-[60vh] mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <File className="h-16 w-16 mb-4 text-muted-foreground" />
              <p className="mb-4">Preview not available for this file type</p>
              <Button asChild>
                <a href={viewingDocument.url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </a>
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDocumentModal}>
            Close
          </Button>
          <Button asChild>
            <a 
              href={viewingDocument.url} 
              target="_blank" 
              rel="noopener noreferrer"
              download={viewingDocument.fileName}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
