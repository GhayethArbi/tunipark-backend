import { Injectable, OnModuleInit } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  sendToToken(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    return getMessaging().send({
      token,
      notification: {
        title,
        body,
      },
      data,
    });
  }
}