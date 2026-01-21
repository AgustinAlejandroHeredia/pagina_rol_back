import { Controller, Post, Body, UseGuards, Param, Get, BadRequestException, Query, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
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
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('mapelem')
export class MapelemController {



    constructor(private readonly mapElemService: MapelemService) {}



    // CREACION
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post(':campaignId')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: CreateMapElemDto })
    async createMapElem(
        @Param('campaignId') campaignId: string,
        @Body() createData: CreateMapElemDto,
        @UploadedFile() file: Express.Multer.File,
    ){
        if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
            throw new BadRequestException('Only png, jpg or jpeg files are allowed')
        }
        console.log('BODY DE CREATE MAPELEM -> ', createData)
        await this.mapElemService.createMapElem(createData, campaignId, file)
    }



    // GET MAP ELEMS by CAMPAIGNID and LAYER
    @ApiBearerAuth('access-token')
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
    @ApiBearerAuth('access-token')
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
        await this.mapElemService.updateMapElem(mapElemId, updateData)
    }


    
    // DELETE
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete(':mapElemId')
    async deleteMapElem(
        @Param('mapElemId') mapElemId: string,
        @Query('pictureId') pictureId: string,
    ){
        if (!Types.ObjectId.isValid(mapElemId)) {
            throw new BadRequestException('Invalid campaignId');
        }
        await this.mapElemService.deleteMapElem(mapElemId, pictureId)
    }

}
