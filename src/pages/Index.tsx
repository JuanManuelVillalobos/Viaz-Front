import StatCard from "@/components/StatCard";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    PackageCheck, Boxes, Truck, AlertTriangle, CreditCard, Archive, FolderOpen
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {useQuery} from "@tanstack/react-query";
import {apiStatsService, MonthlyCarrierRating} from "@/services/api/apiStatsService.ts";

const Index = () => {
    const monthlyData = [
        {name: "Jan", shipments: 65, delivered: 58},
        {name: "Feb", shipments: 59, delivered: 55},
        {name: "Mar", shipments: 80, delivered: 78},
        {name: "Apr", shipments: 81, delivered: 77},
        {name: "May", shipments: 56, delivered: 53},
        {name: "Jun", shipments: 55, delivered: 52},
        {name: "Jul", shipments: 40, delivered: 38},
    ];


    const COLORS = ["#0088FE", "#776424"];

    const {
        data: lastMonthTotalShipments,
        isLoading: isLoadingLastMonthTotalShipments,
        error: errorLastMonthTotalShipments
    } = useQuery<number, Error>({
        queryKey: ['lastMonthTotalShipments'],
        queryFn: apiStatsService.getLastMonthTotalShipments,
    });

    const {
        data: lastMonthClosedShipments,
        isLoading: isLoadingLastMonthClosedShipments,
        error: errorLastMonthClosedShipments,
    } = useQuery<number, Error>({
        queryKey: ['lastMonthClosedShipments'],
        queryFn: apiStatsService.getClosedShipmentsThisMonthCount,
    });


    const {
        data: numberOfShipmentsInTransit,
        isLoading: isLoadingNumberOfShipmentsInTransit,
        error: errorNumberOfShipmentsInTransit
    } = useQuery({
        queryKey: ['numberOfShipmentsInTransit'],
        queryFn: apiStatsService.getShipmentInTransitCount,
    });


    const {
        data: numberOfIssuesOnOpenShipments,
        isLoading: isLoadingNnumberOfIssuesOnOpenShipments,
        error: errorNumberOfIssuesOnOpenShipments
    } = useQuery({
        queryKey: ['numberOfIssuesOnOpenShipments'],
        queryFn: apiStatsService.getNumberOfIssuesOnOpenShipments,
    });

    const {
        data: shipmentsByType,
        isLoading: isLoadingIssuesByType,
        error: errorIssuesByType
    } = useQuery({
        queryKey: ['issuesByType'],
        queryFn: apiStatsService.getFullVsSencilloStats
    });

    const {
        data: monthlyCarrierRatings,
        isLoading: isLoadingMonthlyCarrierRatings,
        error: errorMonthlyCarrierRatings
    } = useQuery<MonthlyCarrierRating[], Error>({
        queryKey: ['monthlyCarrierRatings'],
        queryFn: apiStatsService.getMonthlyCarrierRatings,
    });

    const {
        data: openShipmentsCount,
        isLoading: isLoadingOpenShipmentsCount,
        error: errorOpenShipmentsCount
    } = useQuery({
        queryKey: ['openShipmentsCount'],
        queryFn: apiStatsService.getOpenShipmentsCount,
    });

    const {
        data: cleanedShipmentCount,
        isLoading: isLoadingCleanedShipmentCount,
        error: errorCleanedShipmentCount
    } = useQuery({
        queryKey: ['cleanedShipmentCount'],
        queryFn: apiStatsService.getCleanedShipmentsCount,
    });

    const {
        data: numberOfChargesLastMonth,
        isLoading: isLoadingNumberOfChargesLastMonth,
        error: errorNumberOfChargesLastMonth
    } = useQuery({
        queryKey: ['numberOfChargesLastMonth'],
        queryFn: apiStatsService.getNumberOfChargesLastMonth,
    });


    const pieData = shipmentsByType
        ? Object.entries(shipmentsByType).map(([key, value]) => ({
            name: key,
            value: value.count,
            percentage: value.percentage
        }))
        : [];


    const COLORSLINE = [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff7f50',
        '#a9a9a9',
        '#0088FE',
        '#FF8042',
    ];

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    function transformData(data: MonthlyCarrierRating[]) {
        const grouped: Record<string, any> = {};

        // Get unique carrier names
        const carriers = Array.from(new Set(data.map(d => d.carrierName)));

        // Initialize all months and carriers with null values
        months.forEach(month => {
            grouped[month] = {name: month};
            carriers.forEach(carrierName => {
                grouped[month][carrierName] = null; // Use carrierName as key now
            });
        });

        // Fill actual averageRating values
        data.forEach(({carrierName, monthNumber, averageRating}) => {
            const month = months[monthNumber - 1];
            grouped[month][carrierName] = averageRating;
        });

        // Return sorted array for months with any data point
        return months
            .map(month => grouped[month])
            .filter(item =>
                Object.values(item).some(v => v !== null && v !== item.name)
            );
    }


    const chartData = monthlyCarrierRatings ? transformData(monthlyCarrierRatings) : [];

    const carrierKeys = chartData.length > 0
        ? Array.from(
            new Set(
                chartData.flatMap(item =>
                    Object.keys(item).filter(key => key !== 'name')
                )
            )
        )
        : [];


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tablero</h1>
                <p className="text-muted-foreground">Panorama general de sus operaciones logísticas</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Embarques"
                    value={isLoadingLastMonthTotalShipments ? "..." : errorLastMonthTotalShipments ? "Error" : lastMonthTotalShipments ?? 0}
                    icon={Boxes}
                    description="Embarques totales en los últimos 30 días"
                />

                <StatCard
                    title="Entregados"
                    value={isLoadingLastMonthClosedShipments ? "..." : errorLastMonthClosedShipments ? "Error" : lastMonthClosedShipments ?? 0}
                    icon={PackageCheck}
                    description="Embarques cerrados en los últimos 30 días"
                />
                <StatCard
                    title="En transito"
                    value={isLoadingNumberOfShipmentsInTransit ? "..." : errorNumberOfShipmentsInTransit ? "Error" : numberOfShipmentsInTransit ?? 0}
                    icon={Truck}
                    description="Con estatus en transito"
                />
                <StatCard
                    title="Vacíos"
                    value={cleanedShipmentCount}
                    icon={Archive}
                    description="Embarques con vacío completado"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Calificación de Transportistas</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis domain={[0, 10]}/>
                                <Tooltip/>
                                <Legend/>
                                {carrierKeys.map((carrier, index) => (
                                    <Line
                                        key={carrier}
                                        type="monotone"
                                        dataKey={carrier} // carrierName is used here
                                        stroke={COLORSLINE[index % COLORSLINE.length]}
                                        activeDot={{r: 8}}
                                        connectNulls={true}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Métodos de Transporte</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            {isLoadingIssuesByType ? (
                                <p>Cargando datos...</p>
                            ) : errorIssuesByType ? (
                                <p>Error al cargar datos</p>
                            ) : (
                                <PieChart width={300} height={300}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [`${value} embarques`, name]}
                                    />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Incidentes"
                    value={numberOfIssuesOnOpenShipments}
                    icon={AlertTriangle}
                    description="Número de incidentes en embarques abiertos"
                />

                <StatCard
                    title="Cargos"
                    value={numberOfChargesLastMonth}
                    icon={CreditCard}
                    description="Cargos en los últimos 30 días"
                />

                <StatCard
                    title="Embarques abiertos"
                    value={openShipmentsCount}
                    icon={FolderOpen}
                    description="Número de embarques que se mantienen abiertos"
                />

            </div>
        </div>
    );
};

export default Index;
