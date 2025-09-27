import {useQuery} from '@tanstack/react-query';
import {apiStatsService} from "@/services/api/apiStatsService.ts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const CarrierStats = ({carrierId}) => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['carrierStats', carrierId],
        queryFn: () => apiStatsService.getMonthlyRatingsOfCarrier(carrierId),
        enabled: !!carrierId,
    });

    if (isLoading) {
        return <div>Cargando estadísticas...</div>;
    }

    if (error) {
        return <div>Error al cargar las estadísticas: {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No hay datos de rating disponibles para este transportista.</div>;
    }

    const chartData = data.map(item => ({
        name: item.month, // Use the month abbreviation for the x-axis
        'Calificación Promedio': item.averageRating,
    }));

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Gráfico de Ratings Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis domain={[0, 10]}/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="Calificación Promedio" stroke="#8884d8" activeDot={{r: 8}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Datos de Rating Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mes</TableHead>
                                <TableHead>Rating Promedio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.month}</TableCell>
                                    <TableCell>{item.averageRating.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CarrierStats;