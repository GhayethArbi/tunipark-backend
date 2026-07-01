// dto/send-notification.dto.ts
export class SendNotificationDto {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: Record<string, string>;
}