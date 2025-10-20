import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/use-toast';
import {apiShipmentService} from "@/services/api";
import {FileSpreadsheet} from "lucide-react";

interface ExportShipmentsDialogProps {
    triggerLabel?: string;
    selectedShipments: string[];
    filters: {
        status: string[];
        client: string[];
        carrier: string[];
    };
    search?: string;
    onExportComplete?: () => void;
}

const ExportShipmentsDialog: React.FC<ExportShipmentsDialogProps> = ({
                                                                         triggerLabel = "Exportar",
                                                                         selectedShipments,
                                                                         filters,
                                                                         search,
                                                                         onExportComplete,
                                                                     }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [idFrom, setIdFrom] = useState<string | undefined>(undefined);
    const [idTo, setIdTo] = useState<string | undefined>(undefined);

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const blob = await apiShipmentService.exportShipments(
                filters.status.length > 0 ? filters.status : undefined,
                filters.client.length > 0 ? filters.client : undefined,
                filters.carrier.length > 0 ? filters.carrier : undefined,
                search || undefined,
                idFrom,
                idTo
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `shipments-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Export Successful",
                description: "Shipments have been exported to Excel.",
            });

            onExportComplete?.();
            setIsOpen(false);
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export Failed",
                description: "There was an error exporting shipments to Excel.",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileSpreadsheet className="mr-2 h-4 w-4"/>
                    {triggerLabel}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Export</DialogTitle>
                    <DialogDescription>
                        {selectedShipments.length > 0
                            ? `You are exporting ${selectedShipments.length} selected shipment(s).`
                            : "No specific shipments selected. The export will use filters and ID range."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From ID</label>
                        <input
                            type="text"
                            value={idFrom || ''}
                            onChange={(e) => setIdFrom(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">To ID</label>
                        <input
                            type="text"
                            value={idTo || ''}
                            onChange={(e) => setIdTo(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <p className="text-sm text-gray-500">
                        This will start the download process for your report.
                    </p>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={handleExportExcel}
                        disabled={isExporting}
                    >
                        {isExporting ? "Exporting..." : "Confirm Export"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExportShipmentsDialog;
