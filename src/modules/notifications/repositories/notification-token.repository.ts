export abstract class NotificationTokenRepository {
  abstract saveToken(data: {
    userId: string;
    token: string;
    platform?: string;
  }): Promise<any>;

  abstract findTokensByUserId(userId: string): Promise<string[]>;
}