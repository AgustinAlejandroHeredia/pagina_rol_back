import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

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
    ) {}

    // CREACION
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    @ApiBody({ type: CreateCampaignDto })
    async createCampaign(
        @User('userId') userId: string, 
        @Body() body: { name: string, description: string, system:string } 
    ) {

        if(!body.name || !body.description || !body.system){
            throw new BadRequestException("Faltan uno o mas campos requeridos (name: string, description: string, system: string)")
        }

        return this.campaignService.createCampaign(userId, body.name, body.description, body.system)
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
        console.log("USER ID : ", userId)
        const result = await this.campaignService.getUserCampaingsHome(userId)
        console.log("RESULTADO getUserCampaingsHome : ", JSON.stringify(result, null, 2))
        return result
    }

    // Obtener una campaña dada su id
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get(':id')
    async getCampaignById(@Param('campaignId') campaignId: string){
        const result = await this.campaignService.getCampaignById(campaignId)
        console.log("RESULTADO getCampaignById : ", JSON.stringify(result, null, 2))
        return result
    }

}
