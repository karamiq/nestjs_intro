import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) { }

    async sendUserWelcome(user: User) {
        try {
            this.logger.log(`Attempting to send welcome email to: ${user.email}`);

            const result = await this.mailerService.sendMail({
                to: user.email,
                // override default from
                from: '"Onboarding Team" <support@nestjs-blog.com>',
                subject: 'Welcome to NestJs Blog',
                // `.ejs` extension is appended automatically to template
                template: './welcom',
                // Context is available in email template
                context: {
                    name: user.firstName,
                    email: user.email,
                    loginUrl: 'http://localhost:3000',
                },
            });

            this.logger.log(`Email sent successfully to: ${user.email}`, result);
            return result;
        } catch (error) {
            this.logger.error(`Failed to send email to: ${user.email}`, error);
            throw error;
        }
    }
}