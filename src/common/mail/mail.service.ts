
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {

        console.log("mail useer : ", process.env.MAIL_USER);
        console.log("mail pass : ", process.env.MAIL_PASS);
        console.log("mail pass : ", process.env.MAIL_PORT);
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOtp(to: string, otp: string) {
        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: 'Your OTP for Password Reset',
            html: `<p>Your OTP for resetting your password is:</p><h2>${otp}</h2><p>This OTP is valid for 1 hour.</p>`,

        };
        await this.transporter.sendMail(mailOptions);

    }


    async sendConfirmEmail(email: string, token: string) {
        const confirmationUrl = `http://${process.env.API_BASE_URL}/auth/confirm-email?token=${token}`;
        console.log("wE will send mail to this " + process.env.API_BASE_URL)
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Confirm Your Email',
            html: `
          <h1>Welcome!</h1>
          <p>Click the link below to confirm your email:</p>
          <a href="${confirmationUrl}"> Confirm email</a>
        `,
        };
        console.log("confirm url : ", confirmationUrl);
        await this.transporter.sendMail(mailOptions);
    }
}