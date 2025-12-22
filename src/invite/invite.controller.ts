import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { UserService } from 'src/user/user.service';
import { CampaignService } from 'src/campaign/campaign.service';

// SWAGGER
import { ApiTags } from '@nestjs/swagger';

// PERMISSIONS, DECORATORS, GUARDS
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Invites')
@Controller('invite')
export class InviteController {

    constructor(
        private readonly inviteService: InviteService,
    ){}

    // NO SE TESTEA TODAVIA

    // CREACION
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    async createInvite(
        @User('userId') userId: string,
        @Body() body: { campaign_id: string, email: string }
    ) {

        // verifica que no falten datos
        if(!body.campaign_id.trim() || !body.email.trim()){
            throw new BadRequestException("Faltan uno o mas campos requeridos (campaign_id: string, email: string)")
        }

        return this.inviteService.createInvite(userId, body.campaign_id, body.email)

    }

}
