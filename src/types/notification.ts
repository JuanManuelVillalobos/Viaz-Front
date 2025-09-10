export interface NotificationResponseDTO {
  notificationId: number;
  message: string;
  read: boolean;
  timestamp: string; // ISO date string
}