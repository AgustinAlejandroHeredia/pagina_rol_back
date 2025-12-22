import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { CreateCampaignDto } from './dto/create-campaign.dto';

// SWAGGER
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

// PERMISSIONS, DECORATORS, GUARDS
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    // CREACION
    @Post()
    @ApiBody({ type: CreateCampaignDto })
    async createCampaign(@Body() createData: CreateCampaignDto ) {
        console.log('BODY DE CREATE CAMPAIGN -> ', createData)
        return this.campaignService.createCampaign(createData)
    }

    // PEDIR CAMPAINGS DADA UNA ID (id de auth0 en token)
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('/get_user_campaings')
    async getUserCampaings(@User('userId') userId: string) {
        const result = await this.campaignService.getUserCampaings(userId)
        console.log("RESULTADO getUserCampaings : ", JSON.stringify(result, null, 2))
        return result
    }

    // PEDIR CAMPAINGS DADA UNA ID (id de auth0 en token) PARA HOME (request compuesta)
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('/get_user_campaings_home')
    async getUserCampaingsHome(@User('userId') userId: string) {
        const result = await this.campaignService.getUserCampaingsHome(userId)
        console.log("RESULTADO getUserCampaingsHome : ", JSON.stringify(result, null, 2))
        return result
    }

}
