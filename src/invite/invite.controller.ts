import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, Param, Post, UseGuards } from '@nestjs/common';
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

    // CREACION
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    async createInvite(
        @User('userId') userId: string,
        @Body() body: { campaign_id: string, email: string }
    ) {

        try {
            if (!body.campaign_id?.trim() || !body.email?.trim()) {
                throw new BadRequestException(
                    'Some field is missing (req: campaign_id, email)',
                );
            }

            await this.inviteService.createInvite(
                userId,
                body.campaign_id,
                body.email,
            );

            return {
                success: true,
                message: 'Invitation sent successfully',
            };

        } catch (error) {

            if (error instanceof ConflictException) {
                return {
                    success: false,
                    message: 'Invitation already exists',
                };
            }

            if (error instanceof BadRequestException) {
                return {
                    success: false,
                    message: error.message,
                };
            }

            return {
                success: false,
                message: 'Something went wrong',
            };
        }
    }

    // JOIN CAMPAIGN
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('/joinCampaign/:token/:alias')
    async joinCampaign(
        @Param('token') token: string,
        @Param('alias') alias: string,
    ) {
        console.log("TOKEN INVITATION RECIVED : ", token)
        await this.inviteService.validateInvite(token, alias)
    }

}
