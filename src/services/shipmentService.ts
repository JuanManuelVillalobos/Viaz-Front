// Get status colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Entregado":
      return "bg-green-500";
    case "in-transit":
      return "bg-blue-500";
    case "Ingresado":
      return "bg-yellow-500";
    case "delayed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
