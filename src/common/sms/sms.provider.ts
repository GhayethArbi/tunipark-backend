export interface SmsProvider {
  send(to: string, message: string): Promise<{ providerMessageId?: string }>;
}
