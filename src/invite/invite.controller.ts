import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Post, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { UserService } from 'src/user/user.service';
import { CampaignService } from 'src/campaign/campaign.service';

// SWAGGER
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    async createInvite(
        @User('userId') userId: string,
        @Body() body: { campaign_id: string, email: string }
    ) {
        if (!body.campaign_id?.trim() || !body.email?.trim()) {
            throw new BadRequestException(
                'Some field is missing (req: campaign_id, email)',
            )
        }
        return await this.inviteService.createInvite(
            userId,
            body.campaign_id,
            body.email,
        )
    }



    // JOIN CAMPAIGN
    @ApiBearerAuth('access-token')
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



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('admin:page')
    @Get("/admin/getInvitesAsAdmin")
    async getInvitesAsAdmin(){
        const result = await this.inviteService.getInvitesAsAdmin()
        console.log("INVITES AS ADMIN : ", result)
        return result
    }



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('admin:page')
    @Delete("/admin/deleteInviteAsAdmin/:inviteId")
    async deleteInviteAsAdmin(
        @Param('inviteId') inviteId: string
    ){
        await this.inviteService.deleteInvite(inviteId)
    }

}
