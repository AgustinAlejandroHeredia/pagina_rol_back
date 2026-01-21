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
        await this.fileMongoService.createFileMongo(body.fileId)
    }



    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Patch(':fileId')
    @ApiBody({ type: UpdateFileMongoDto })
    async updateFileView(
        @Param('fileId') fileId: string,
        @Body() updateData: UpdateFileMongoDto,
    ){
        await this.fileMongoService.updateFileView(fileId, updateData)
    }



    @ApiBearerAuth('access-token') // Para swagger
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete(':fileId')
    async deleteFileMongo(
        @Param('fileId') fileId: string,
    ){
        await this.fileMongoService.deleteFileMongo(fileId)
    }

}
