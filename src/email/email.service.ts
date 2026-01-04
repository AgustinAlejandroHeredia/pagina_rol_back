import { Injectable } from '@nestjs/common';

// EMAILS
import { MailerService } from '@nestjs-modules/mailer';

// CONFIG
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendEmail(
        to: string,
        token: string,
        campaignName: string,
    ){

        console.log("EMAILS SERVICES DATA: ", to ," ", token," ", campaignName)

        const web_url = this.configService.get<string>('FRONT_URL')

        const subject = "Invitation"

        const text = `You have been invited to the campaign "${campaignName}" on Roleplay Web App, you can enter to ${web_url} and once you sing up, go to "Join Campaign" and enter this token : ${token} .`

        const html = `
            <h2>You're invited!</h2>
            <p>You have been invited to the campaign <b>${campaignName}</b>.</p>
            <p>
                Go to <a href="${web_url}">${web_url}</a> and enter this token:
            </p>
            <pre>${token}</pre>
        `;

        try {
            await this.mailerService.sendMail({
            to,
            subject,
            html,
            });

            console.log('✅ Email enviado correctamente a:', to);
        } catch (error) {
            console.error('❌ Error enviando email:', error);
            throw error; // o NO lanzar si no querés romper el flujo
        }
    }

}
