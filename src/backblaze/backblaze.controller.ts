import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';

// SWAGGER
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Post('uploadFile')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (req, file, cb) => {

                const allowedMimeTypes = [
                    'image/png',
                    'image/jpeg',
                    'application/pdf',
                ];

                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException(
                            'Invalid file type. Only PNG, JPG and PDF are allowed'
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
        @UploadedFile() file: Express.Multer.File, 
        @Body('campaignId') campaignId: string, 
        @Body('folder') folder: string,
    ){
        if (!file) {
            throw new BadRequestException('Missing file');
        }

        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        if (!folder) {
            throw new BadRequestException('Missing folder name');
        }

        return this.backblazeService.uploadFile(file, campaignId, folder)
    }

    // Borra la carpeta que este dentro de la campaña indicada
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
    @Delete('deleteCampaignFiles')
    async deleteCampaignFiles(
        @Body('campaignId') campaignId: string, 
    ){
        if (!campaignId) {
            throw new BadRequestException('Missing campaign id');
        }

        return this.backblazeService.deleteCampaignFiles(campaignId)
    }

    @Get('compendium/:campaignId')
    async getCompendiumFiles(@Param('campaignId') campaignId: string){
        const result = this.backblazeService.listCompendiumFiles(campaignId)
        console.log("RESULTADO getCompendiumFiles : ", JSON.stringify(result, null, 2))
        return result
    }

}
