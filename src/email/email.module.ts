import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

// CONFIG
import { ConfigService } from '@nestjs/config';

// EMAILS
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get('MAIL_PORT')),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Roleplay Web App" <no-reply@roleplayweb.com>`,
          replyTo: 'no-reply@roleplayweb.com',
        },
      }),
    }),
  ],
  //controllers: [EmailController], // no hay endpoints
  providers: [EmailService],
  exports: [EmailService]
})

export class EmailModule {}
