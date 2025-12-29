import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { MapelemService } from './mapelem.service';

import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { CreateMapElemDto } from './dto/create-mapelem.dto';

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

}
