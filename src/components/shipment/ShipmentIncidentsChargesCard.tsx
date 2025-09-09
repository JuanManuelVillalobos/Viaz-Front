import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {AlertTriangle, DollarSign} from "lucide-react";
import {format} from "date-fns";
import {ShipmentCharge, ShipmentIncident} from "@/types/api.ts"

interface Props {
    incidents: ShipmentIncident[];
    charges: ShipmentCharge[];
    isLoading: boolean;
    error?: string;
}

export const ShipmentIncidentsChargesCard = ({incidents, charges, isLoading, error}: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/>
                    Incidents & Charges
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Loading / Error */}
                {isLoading ? (
                    <p className="text-muted-foreground">Loading shipment details...</p>
                ) : error ? (
                    <p className="text-destructive">Error: {error}</p>
                ) : (
                    <>
                        {/* Incidents Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4"/> Incidents
                            </h3>
                            {incidents.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No incidents reported.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {incidents.map((incident, index) => (
                                        <li key={index} className="border p-3 rounded-md bg-muted/40">
                                            <div className="text-sm font-medium">
                                                {incident.incidentType}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {incident.comment}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(incident.occurredAt), "dd MMM yyyy, HH:mm")}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Charges Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4"/> Charges
                            </h3>
                            {charges.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No charges recorded.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {charges.map((charge, index) => (
                                        <li key={index} className="border p-3 rounded-md bg-muted/40">
                                            <div className="text-sm font-medium">
                                                {charge.chargeType}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {charge.comment}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(charge.occurredAt), "dd MMM yyyy, HH:mm")}
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
