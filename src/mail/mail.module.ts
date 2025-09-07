import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailController } from './mail.controller';

// Making the MailModule global so that we don't have to import it in other modules
// so it can be used anywhere in the application
// without the need to add it to the imports array of other modules
// This is useful for services that are used throughout the application
// like MailService, AuthService, etc.
@Global()
@Module({
    providers: [MailService],
    controllers: [MailController],
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get<string>('mailConfig.mailHost'),
                    secure: config.get<string>('mailConfig.mailHost') === 'smtp.gmail.com', // true for Gmail
                    port: config.get<string>('mailConfig.mailHost') === 'smtp.gmail.com' ? 465 : 2525,
                    auth: {
                        user: config.get<string>('mailConfig.smtpUsername'),
                        pass: config.get<string>('mailConfig.smtpPassword'),
                    },
                },
                defaults: {
                    from: `"from 2000 from you to 2000 year to you`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter({
                        inlineCssEnabled: true,
                    }),
                    options: {
                        strict: false,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [MailService]

})
export class MailModule { }