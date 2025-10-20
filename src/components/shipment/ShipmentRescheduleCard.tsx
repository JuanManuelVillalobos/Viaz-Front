import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ArrowRightCircle} from "lucide-react";
import {format} from "date-fns";
import {apiIncidentService} from "@/services/api";
import {Shipment} from "@/types/shipment";
import {toast} from "@/hooks/use-toast";

interface ShipmentRescheduleCardProps {
    shipment: Shipment;
}

export function ShipmentRescheduleCard({shipment}: ShipmentRescheduleCardProps) {
    const queryClient = useQueryClient();

    if (!shipment?.open) return null;

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({newUnloadDateTime: "", comment: ""});

    const updateForm = (field: keyof typeof form, value: string) =>
        setForm((prev) => ({...prev, [field]: value}));

    const validateForm = () => {
        if (!form.newUnloadDateTime) {
            toast({
                title: "Error",
                description: "Por favor, seleccione una fecha y hora.",
                variant: "destructive",
            });
            return false;
        }
        if (!form.comment.trim()) {
            toast({
                title: "Error", 
                description: "Por favor, agregue un comentario.",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const rescheduleMutation = useMutation({
        mutationFn: (data: { newUnloadTime: string; comment: string }) =>
            apiIncidentService.rescheduleShipment(shipment.fullViazId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shipment", shipment.fullViazId]});
            queryClient.invalidateQueries({queryKey: ["shipmentIncidents", shipment.fullViazId]});
            toast({
                title: "Éxito",
                description: "Embarque reprogramado exitosamente!",
            });
            setDialogOpen(false);
            setForm({newUnloadDateTime: "", comment: ""});
        },
        onError: (error: any) => {
            toast({
                title: "Error al reprogramar el embarque",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = () => {
        if (!validateForm()) return;

        rescheduleMutation.mutate({
            newUnloadTime: new Date(form.newUnloadDateTime).toISOString(),
            comment: form.comment,
        });
    };

    const {data: rescheduleDetails} = useQuery({
        queryKey: ["reschedule-details", shipment.fullViazId],
        queryFn: () => apiIncidentService.getRescheduleDetails(shipment.fullViazId),
        enabled: !!shipment.hasReschedule,
    });

    if (shipment.hasReschedule) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Reprogramación de Descarga</CardTitle>
                    <CardDescription>
                        Este embarque ya tiene una reprogramación.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2 border border-dashed border-gray-400">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                            <ArrowRightCircle className="h-4 w-4"/>
                            <p>Nueva fecha de descarga:</p>
                        </div>
                        {rescheduleDetails?.newUnloadDate && (
                            <p className="font-bold text-lg">
                                {format(new Date(rescheduleDetails.newUnloadDate), "dd MMMM yyyy, HH:mm")}
                            </p>
                        )}
                        {rescheduleDetails?.comment && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <p className="font-semibold">Comentario:</p>
                                <p className="italic">{rescheduleDetails.comment}</p>
                            </div>
                        )}
                        {rescheduleDetails?.occurredAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {format(new Date(rescheduleDetails.occurredAt), "dd MMM yyyy, HH:mm")}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                className="w-full"
                disabled={rescheduleMutation.isPending}
            >
                Reprogramar Descarga
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reprogramar Descarga</DialogTitle>
                        <DialogDescription>
                            Seleccione la nueva fecha y hora de descarga y agregue un comentario.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-unload-datetime">Nueva Fecha y Hora</Label>
                            <Input
                                id="new-unload-datetime"
                                type="datetime-local"
                                value={form.newUnloadDateTime}
                                onChange={(e) => updateForm("newUnloadDateTime", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comment">Comentario</Label>
                            <Textarea
                                id="comment"
                                placeholder="Escribe tu comentario aquí..."
                                value={form.comment}
                                onChange={(e) => updateForm("comment", e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={rescheduleMutation.isPending}>
                            {rescheduleMutation.isPending ? "Reprogramando..." : "Reprogramar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}