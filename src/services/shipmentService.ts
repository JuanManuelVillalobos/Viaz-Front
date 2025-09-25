// Get status colors

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "Información Pendiente":
        case "Folio Pendiente":
        case "Maniobras Pendientes":
            return "bg-yellow-500 hover:bg-yellow-600";

        case "Todo Ok":
            return "bg-green-500 hover:bg-green-600";

        case "En Puerto":
            return "bg-blue-500 hover:bg-blue-600";

        case "En Transito":
            return "bg-blue-400 hover:bg-blue-500";

        case "En Destino":
            return "bg-blue-600 hover:bg-blue-700";

        case "POD Pendiente":
        case "Vacío Pendiente":
            return "bg-red-500 hover:bg-red-600";

        case "Ingresado":
            return "bg-green-400 hover:bg-green-500";

        case "Egresado":
            return "bg-green-600 hover:bg-green-700";

        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
};
