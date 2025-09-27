import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertTriangle, DollarSign, Trash2} from "lucide-react";
import {format} from "date-fns";
import {ShipmentCharge, ShipmentIncident} from "@/types/api.ts";
import {usePermissions} from "@/hooks/usePermissions";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apiShipmentService} from "@/services/api";
import {toast} from "@/hooks/use-toast";

interface Props {
    incidents: ShipmentIncident[];
    charges: ShipmentCharge[];
    isLoading: boolean;
    error?: string;
    shipmentId?: string;
}

export const ShipmentIncidentsChargesCard = ({incidents, charges, isLoading, error, shipmentId}: Props) => {
    const {hasPermission} = usePermissions();
    const queryClient = useQueryClient();

    const deleteIncidentMutation = useMutation({
        mutationFn: apiShipmentService.deleteIncident,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipmentIncidents', shipmentId]});
            queryClient.invalidateQueries({queryKey: ["shipment", shipmentId]});
            toast({
                title: 'Incidente eliminado',
                description: 'El incidente ha sido eliminado exitosamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el incidente.',
                variant: 'destructive',
            });
        },
    });

    const deleteChargeMutation = useMutation({
        mutationFn: apiShipmentService.deleteCharge,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shipmentCharges', shipmentId]});
            toast({
                title: 'Cargo eliminado',
                description: 'El cargo ha sido eliminado exitosamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el cargo.',
                variant: 'destructive',
            });
        },
    });

    const canDeleteIncidents = hasPermission('SHIPMENT_INCIDENT_DELETE');
    const canDeleteCharges = hasPermission('SHIPMENT_CHARGE_DELETE');
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/>
                    Incidentes y Cargos
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Loading / Error */}
                {isLoading ? (
                    <p className="text-muted-foreground">Cargando detalles...</p>
                ) : error ? (
                    <p className="text-destructive">Error: {error}</p>
                ) : (
                    <>
                        {/* Incidents Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4"/> Incidentes
                            </h3>
                            {incidents.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No hay incidentes reportados</p>
                            ) : (
                                <ul className="space-y-2">
                                    {incidents.map((incident, index) => (
                                        <li key={index} className="border p-3 rounded-md bg-muted/40">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">
                                                        {incident.incidentType}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {incident.comment}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(incident.occurredAt), "dd MMM yyyy, HH:mm")}
                                                    </div>
                                                </div>
                                                {canDeleteIncidents && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteIncidentMutation.mutate(incident.shipmentIncidentId)}
                                                        disabled={deleteIncidentMutation.isPending}
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Charges Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4"/> Cargos
                            </h3>
                            {charges.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No hay cargos reportados</p>
                            ) : (
                                <ul className="space-y-2">
                                    {charges.map((charge, index) => (
                                        <li key={index} className="border p-3 rounded-md bg-muted/40">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">
                                                        {charge.chargeType}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {charge.comment}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(charge.occurredAt), "dd MMM yyyy, HH:mm")}
                                                    </div>
                                                </div>
                                                {canDeleteCharges && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteChargeMutation.mutate(charge.shipmentChargeId)}
                                                        disabled={deleteChargeMutation.isPending}
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
