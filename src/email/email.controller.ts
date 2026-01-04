import { Controller } from '@nestjs/common';

// EMAIL SERVICE
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {

    constructor(
        private readonly emailService: EmailService,
    ) {}

    

}
