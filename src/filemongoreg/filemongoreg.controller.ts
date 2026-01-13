import { BadRequestException, Body, Controller, Delete, InternalServerErrorException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FileMongoRegService } from './filemongoreg.service';

// PERMISSIONS, DECORATORS, GUARDS
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';

// SWAGGEE
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

// DTO
import { FileMongoDto } from './dto/file-mongo.dto';
import { UpdateFileMongoDto } from './dto/update-file-mongo.dto';

@ApiTags('Files')
@Controller('filemongoreg')
export class FileMongoRegController {

    constructor(
        private readonly fileMongoService: FileMongoRegService
    ){}

    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post()
    @ApiBody({ type: FileMongoDto })
    async createFileMongo(
        @Body() body: {fileId: string, visibility: boolean}
    ){
        if(!body.fileId) throw new BadRequestException("Falta la id del archivo")
        return this.fileMongoService.createFileMongo(body.fileId)
    }

    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Patch(':fileId')
    async updateFileView(
        @Param('fileId') fileId: string,
        @Body() updateData: UpdateFileMongoDto,
    ){
        if(!fileId || !updateData) throw new BadRequestException("Faltan datos")
        const updated = await this.fileMongoService.updateFileView(fileId, updateData)

        if(!updated) throw new InternalServerErrorException("Error al hacer el update del archivo en mongo")
    
        return updated
    }


    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete(':fileId')
    async deleteFileMongo(
        @Param('fileId') fileId: string,
    ){
        if(!fileId) throw new BadRequestException("Falta la id del archivo")
        return this.fileMongoService.deleteFileMongo(fileId)
    }

}
