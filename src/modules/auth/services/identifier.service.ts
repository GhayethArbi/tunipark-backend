import { Injectable } from '@nestjs/common';

export enum IdentifierType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

@Injectable()
export class IdentifierService {
  detect(value: string): IdentifierType {
    const identifier = value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(identifier)) {
      return IdentifierType.EMAIL;
    }

    return IdentifierType.PHONE;
  }

  normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}