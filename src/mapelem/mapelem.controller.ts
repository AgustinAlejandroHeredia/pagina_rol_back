import { Controller, Post, Body, UseGuards, Param, Get, BadRequestException, Query, Patch, Delete } from '@nestjs/common';
import { MapelemService } from './mapelem.service';

import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';

// DTO
import { CreateMapElemDto } from './dto/create-mapelem.dto';
import { UpdateMapElemDto } from './dto/update-mapelem.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// SWAGGER
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('mapelem')
export class MapelemController {

    constructor(private readonly mapElemService: MapelemService) {}

    // CREACION
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post(':campaignId')
    @ApiBody({ type: CreateMapElemDto })
    async createMapElem(
        @Param('campaignId') campaignId: string,
        @Body() createData: CreateMapElemDto,
    ){
        console.log('BODY DE CREATE MAPELEM -> ', createData)
        return this.mapElemService.createMapElem(createData, campaignId)
    }

    // GET MAP ELEMS by CAMPAIGNID and LAYER
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('getMapsElemsByCampaignIdAndLayer/:campaignId')
    async getMapsElemsByCampaignIdAndLayer(
        @Param('campaignId') campaignId: string,
        @Query('layer') layer: number,
    ){
        if (!Types.ObjectId.isValid(campaignId)) {
            throw new BadRequestException('Invalid campaignId');
        }

        const result = await this.mapElemService.getMapsElemsByCampaignIdAndLayer(campaignId, Number(layer))
        console.log("RESULTADO getMapElems : ", JSON.stringify(result, null, 2))
        return result
    }

    // UPDATE
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Patch(':mapElemId')
    async updateMapElem(
        @Param('mapElemId') mapElemId: string,
        @Body() updateData: UpdateMapElemDto,
    ){
        if (!Types.ObjectId.isValid(mapElemId)) {
            throw new BadRequestException('Invalid campaignId');
        }

        const result = await this.mapElemService.updateMapElem(mapElemId, updateData)
        console.log("RESULTADO updateMapElem : ", JSON.stringify(result, null, 2))
        return result
    }

    // DELETE
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete(':mapElemId')
    async deleteMapElem(
        @Param('mapElemId') mapElemId: string,
    ){
        if (!Types.ObjectId.isValid(mapElemId)) {
            throw new BadRequestException('Invalid campaignId');
        }

        const result = await this.mapElemService.deleteMapElem(mapElemId)
        console.log("RESULTADO deleteMapElem : ", JSON.stringify(result, null, 2))
        return result
    }

}
