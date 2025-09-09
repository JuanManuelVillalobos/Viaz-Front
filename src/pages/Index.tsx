import StatCard from "@/components/StatCard";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Package, PackageCheck, TruckIcon, UserPlus,
    AlertCircle, Anchor, Ship
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {useQuery} from "@tanstack/react-query";
import {apiShipmentService} from "@/services/api";

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

    const pieData = [
        {name: "Marítimo", value: 60},
        {name: "Terrestre", value: 40},
    ];

    const COLORS = ["#0088FE", "#776424"];

    const {data: numberOfShipments, isLoading, error} = useQuery({
        queryKey: ['lastMonthTotalShipments'],
        queryFn: apiShipmentService.getLastMonthTotalShipments,
    });


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your shipping operations</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Embarques"
                    value={isLoading ? "..." : error ? "Error" : numberOfShipments ?? 0}
                    icon={Package}
                    description="Embarques este mes"
                    trend={{value: "12%", positive: true}}
                />

                <StatCard
                    title="Entregados"
                    value="1,043"
                    icon={PackageCheck}
                    description="Successfully delivered"
                    trend={{value: "8%", positive: true}}
                />
                <StatCard
                    title="En transito"
                    value="205"
                    icon={TruckIcon}
                    description="Currently in transit"
                />
                <StatCard
                    title="Vacíos"
                    value="24"
                    icon={UserPlus}
                    description="New users this month"
                    trend={{value: "5%", positive: true}}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Calificación de Transportistas</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line
                                    type="monotone"
                                    dataKey="shipments"
                                    stroke="#8884d8"
                                    activeDot={{r: 8}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="delivered"
                                    stroke="#82ca9d"
                                />
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
                            <PieChart>
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
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">Pending issues to resolve</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ports</CardTitle>
                        <Anchor className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">Active shipping ports</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Carriers</CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Active carriers</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Index;
