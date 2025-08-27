// Get status colors
import {SelectItem} from "@/components/ui/select.tsx";

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "Información Pendiente":
            return "bg-yellow-500";   // warning

        case "Folio Pendiente":
            return "bg-yellow-500";   // warning

        case "Maniobras Pendientes":
            return "bg-yellow-500";   // warning

        case "Todo Ok":
            return "bg-green-500";    // success

        case "En Puerto":
            return "bg-blue-500";     // neutral / in port

        case "En Transito":
            return "bg-blue-400";     // moving, but not bad

        case "En Destino":
            return "bg-blue-600";     // reached destination

        case "POD Pendiente":
            return "bg-red-500";      // error / pending doc

        case "Vacío Pendiente":
            return "bg-red-500";      // error / pending empty return

        case "Ingresado":
            return "bg-green-400";    // good, already registered

        case "Egresado":
            return "bg-green-600";    // success / final

        default:
            return "bg-gray-500";
    }
};