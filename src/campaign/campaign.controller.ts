import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';

// DTOs
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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
    @ApiBearerAuth('access-token') // Para swagger
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

    // UPDATE
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Patch(':campaignId')
    async updateCampaign(
        @Param('campaignId') campaignId: string,
        @Body() updateData: UpdateCampaignDto
    ){
        if(!Types.ObjectId.isValid(campaignId)) {
            throw new BadRequestException('Invalid campaign id')
        }

        const updated = await this.campaignService.updateCampaign(campaignId, updateData)

        if(!updated){
            throw new BadRequestException('Error during campaign update')
        }

        return updated
    }

    // DELETE
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete(':campaignId')
    async deleteCampaign(
        @Param('campaignId') campaignId: string,
    ) {
        if(!Types.ObjectId.isValid(campaignId)) {
            throw new BadRequestException('Invalid campaign id')
        }

        return this.campaignService.deleteCampaign(campaignId)
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
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get(':campaignId')
    async getCampaignById(@Param('campaignId') campaignId: string){
        console.log("CAMPAIGN ID : ", campaignId)
        const result = await this.campaignService.getCampaignById(campaignId)
        console.log("RESULTADO getCampaignById : ", JSON.stringify(result, null, 2))
        return result
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

    // Pide los usuarios de una campaña dada la id de una campaña
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('/get_campaign_users/:campaignId')
    async getUsersCampaign(@Param('campaignId') campaignId: string){
        const result = await this.campaignService.getUsersCampaign(campaignId)
        console.log("RESULTADO getUsersCampaign ; ", JSON.stringify(result, null, 2))
        return result
    }

    // Dada la id de una campaña, pregunta si el user (token) es dm de la campaña que esta consultando
    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('/is_dungeon_master/:campaignId')
    async isDungeonMaster(
        @Param('campaignId') campaignId: string,
        @User('userId') userId: string,
    ) {
        const result = await this.campaignService.isDungeonMaster(campaignId, userId)
        console.log("RESULTADO isDungeonMaster : ", JSON.stringify(result, null, 2))
        return result
    }

}
