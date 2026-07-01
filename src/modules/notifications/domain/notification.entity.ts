export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly body: string,
    public readonly type: string,
    public readonly data: Record<string, any> | null,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly readAt?: Date | null,
  ) {}
}