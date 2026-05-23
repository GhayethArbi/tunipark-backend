import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static makeClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || connectionString.trim().length === 0) {
      throw new Error('DATABASE_URL is missing. Check your .env file and dotenv/config import.');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
  }

  constructor() {
    // Build a fully valid PrismaClient and pass its options into super
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString || connectionString.trim().length === 0) {
      // This gives you a clear error instead of Prisma "invalid options"
      throw new Error('DATABASE_URL is missing. Put it in .env and restart the app.');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
