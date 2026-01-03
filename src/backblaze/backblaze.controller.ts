import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';

// SWAGGER
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// TYPE
import { ALLOWED_MIME_TYPES } from './upload-file-types';

// PERMISSIONS, DECORATORS, GUARDS
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Backblaze')
@Controller('backblaze')

/*
BACKEND DESIGN RULE:

    IF THE NAME GETS SANITIZED AND HAS AN ELEMENT LIKE /, * OR SIMILAR, IT AUTOMATICALLY THROWS "BadRequestException"

*/

export class BackblazeController {

    constructor(
        private readonly backblazeService: BackblazeService,
    ){}

    // Se usa para crear la estructura de archivos en Backblaze para trabajar luego
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post('initialize/:campaignId')
    async initializeCampaignStorage(
        @Param('campaignId') campaignId: string
    ) {
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        return this.backblazeService.initializeCampaignStorage(campaignId);
    }

    // Crea una carpeta con el nombre dado en la campaña que se indica
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post('createFolder/:campaignId/:folderName')
    async createFolder(
        @Param('campaignId') campaignId: string,
        @Param('folderName') folderName: string,
    ) {
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        if (!folderName) {
            throw new BadRequestException('Missing folder name');
        }

        return this.backblazeService.createFolder(campaignId, folderName)
    }

    // dado un archivo (SOLO png, jpeg y pdf) lo sube a la carpeta de la campaña indicada
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post('uploadFile/:campaignId')
    @UseInterceptors(
        FileInterceptor('files', {
            fileFilter: (req, file, cb) => {

                if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException(
                            'Invalid file type.'
                        ),
                        false
                    );
                }

                cb(null, true);
            },
            /*
            limits: {
                fileSize: 10 * 1024 * 1024, // 10mb
            },
            */
        }),
    )
    async uploadFile(
        @UploadedFile() files: Express.Multer.File[], 
        @Param('campaignId') campaignId: string,
        @Body('folder') folder: string,
    ){
        if (!files) {
            throw new BadRequestException('Missing file');
        }

        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        if (!folder) {
            throw new BadRequestException('Missing folder name');
        }

        return this.backblazeService.uploadFiles(files, campaignId, folder)
    }

    // Borra la carpeta que este dentro de la campaña indicada
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete('deleteFolder')
    async deleteFolder(
        @Body('campaignId') campaignId: string, 
        @Body('folderName') folderName: string,
    ){
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        if (!folderName) {
            throw new BadRequestException('Missing folder name');
        }

        return this.backblazeService.deleteFolder(campaignId, folderName)
    }

    // Borra el archivo dentro de la carpeta en la campaña indicada
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete('deleteFile')
    async deleteFile(
        @Body('campaignId') campaignId: string, 
        @Body('folderName') folderName: string,
        @Body('fileName') fileName: string,
    ){
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        if (!folderName) {
            throw new BadRequestException('Missing folder name');
        }

        if (!fileName) {
            throw new BadRequestException('Missing file name');
        }

        return this.backblazeService.deleteFile(campaignId, folderName, fileName)
    }

    // Borra la campaña indicada (solo admin o user que la haya creado)
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Delete('deleteCampaignFiles')
    async deleteCampaignFiles(
        @Body('campaignId') campaignId: string, 
    ){
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        return this.backblazeService.deleteCampaignFiles(campaignId)
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('compendium/:campaignId')
    async getCompendiumFiles(
        @Param('campaignId') campaignId: string
    ){
        const result = await this.backblazeService.listCompendiumFiles(campaignId)
        console.log("RESULTADO getCompendiumFiles : ", result)
        return result
    }

}
