import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './providers/mail.service';
import { User } from 'src/users/user.entity';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Auth(AuthType.None)
    @Post('test-welcome')
    @ApiOperation({ summary: 'Test welcome email sending' })
    @ApiResponse({ status: 200, description: 'Email sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async testWelcomeEmail() {


        const testUser: User = {
            email: "mppp519@gmail.com",
            firstName: "Karam",
            lastName: "Rashee",
            id: 1,
            posts: [],
        };

        try {
            await this.mailService.sendUserWelcome(testUser);
            return {
                success: true,
                message: `Welcome email sent successfully to ${testUser.email}`,
            };
        } catch (error) {
            throw new BadRequestException(`Failed to send email: ${error.message}`);
        }
    }
}
