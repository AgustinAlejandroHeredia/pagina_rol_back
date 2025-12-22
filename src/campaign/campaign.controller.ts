import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

// USERS SERVICE
import { UserService } from 'src/user/user.service';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignController {
    constructor(
        private readonly campaignService: CampaignService,
        private readonly userService: UserService
    ) {}

    // CREACION
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    @ApiBody({ type: CreateCampaignDto })
    async createCampaign(
        @User('userId') userId: string, 
        @Body() body: { name: string, description: string, system:string } ) 
    {

        if(!body.name || !body.description || !body.system){
            throw new BadRequestException("Faltan uno o mas campos requeridos (name: string, description: string, system: string)")
        }

        const dungeonMasterResult = await this.userService.getUserByAuth0Id(userId)
        if(!dungeonMasterResult){
            throw new BadRequestException("Error en autenticacion")
        }

        const dungeonMaster = {
            auth0_id: dungeonMasterResult.auth0_id,
            mongo_id: dungeonMasterResult._id.toString(),
            alias: "Dungeon Master"
        }

        const campaignData : CreateCampaignDto = {
            name: body.name,
            description: body.description,
            system: body.system,
            dungeonMaster,
            users: [dungeonMaster]
        }

        console.log('BODY DE CREATE CAMPAIGN -> ', campaignData)
        return this.campaignService.createCampaign(campaignData)
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
