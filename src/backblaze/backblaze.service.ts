import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// Config
import { ConfigService } from '@nestjs/config';

// BACKBLAZE
import BackBlazeB2 from 'backblaze-b2'
const B2 = require('backblaze-b2')

// Auxiliares para backblaze
import multer from 'multer';
import { application, NextFunction, Response } from 'express';
import { NestFactory } from '@nestjs/core';

@Injectable()
export class BackblazeService {

    private b2: BackBlazeB2
    private readonly logger = new Logger()

    constructor(
        private readonly configService: ConfigService
        // @InjectModel(archivo a tratar) private archivoModel: Model<Archivo>
    ){
        this.b2 = new B2({
            applicationKeyId: this.configService.get<string>('B2_KEY_ID'),
            applicationKey: this.configService.get<string>('B2_APPLICATION_KEY'),
        })
    }





    // Authorization basic
    private async getAuthorizedUploadUrl() {
        await this.b2.authorize()
        const bucketId = this.configService.get<string>('B2_BUCKET_ID')
        return this.b2.getUploadUrl({ bucketId })
    }

    // Sanitize folder name
    private sanitizeFolderName(folderName: string): string {

        if(!folderName){
            throw new BadRequestException('Folder name is required')
        }

        const sanitized = folderName.trim()
        const validNameRegex = /^[a-zA-Z0-9-_]+$/

        if(!validNameRegex.test(sanitized)) {
            throw new BadRequestException(
                'Invalid folder name. Only letters, numbers, "-" and "_" are allowed'
            )
        }

        return sanitized
    }

    // Sanitize file name
    private sanitizeFileName(fileName: string): string {

        if (!fileName) {
            throw new BadRequestException('File name is required');
        }

        const sanitized = fileName.trim();

        // no permitir rutas
        if (sanitized.includes('/') || sanitized.includes('\\')) {
            throw new BadRequestException(
                'Invalid file name. Path separators are not allowed'
            );
        }

        // nombre.ext
        const validFileNameRegex = /^[a-zA-Z0-9._-]+$/;

        if (!validFileNameRegex.test(sanitized)) {
            throw new BadRequestException(
                'Invalid file name. Only letters, numbers, ".", "-", and "_" are allowed'
            );
        }

        // debe tener extensión
        if (!sanitized.includes('.')) {
            throw new BadRequestException(
                'Invalid file name. File extension is required'
            );
        }

        return sanitized;
    }





    // TESTED
    // Crea la estructura basica para la campaña --> ID_CAMPAÑA /icons y /compendium
    async initializeCampaignStorage(campaignId: string){
        try {

            const uploadUrlData = await this.getAuthorizedUploadUrl()

            const folders = [
                `${campaignId}/icons/.keep`,
                `${campaignId}/compendium/.keep`,
            ]

            for (const fileName of folders) {

                await this.b2.uploadFile({
                    uploadUrl: uploadUrlData.data.uploadUrl,
                    uploadAuthToken: uploadUrlData.data.authorizationToken,
                    fileName,
                    data: Buffer.alloc(0)
                })
            }

            console.log("Estructura de archivos creada")

        } catch (error) {
            throw new InternalServerErrorException('Error creating the campaign file structure')
        }
    }

    // TESTED
    async deleteCampaignSorage(campaignId: string){
        try {

            await this.b2.authorize();

            const bucketId = this.configService.get<string>('B2_BUCKET_ID')
            const prefix = `${campaignId}/`
            let nextFileName: string | undefined

            do {

                const response = await this.b2.listFileNames({
                    bucketId,
                    prefix,
                    startFileName: nextFileName
                })

                for (const file of response.data.files) {
                    await this.b2.deleteFileVersion({
                        fileId: file.fileId,
                        fileName: file.fileName,
                    })
                }

                nextFileName = response.data.nextFileName

            } while (nextFileName)

        } catch (error) {
            console.error("Error deleting campaign folder : ", error)
            throw new InternalServerErrorException("Error deleting campaign folder")
        }
    }

    // TESTED
    // Crea una carpeta nueva en la campaña indicada (sanitiza nombre, si falla devuelve internal error)
    async createFolder(campaignId: string, folderName: string){
        try {

            const uploadUrlData = await this.getAuthorizedUploadUrl()

            const safeFolderName = this.sanitizeFolderName(folderName)

            const fileName = `${campaignId}/${safeFolderName}/.keep`

            await this.b2.uploadFile({
                uploadUrl: uploadUrlData.data.uploadUrl,
                uploadAuthToken: uploadUrlData.data.authorizationToken,
                fileName,
                data: Buffer.alloc(0)
            })

        } catch (error) {
            throw new InternalServerErrorException('Error new creating the campaign folder')
        }
    }

    // Se sube un archivo indicando campaña y carpeta de compendium
    async uploadFile(file: Express.Multer.File, campaignId: string, folder: string){
        try {

            const uploadUrlData = await this.getAuthorizedUploadUrl()

            const safeFileName = this.sanitizeFileName(file.originalname)
            const fileName = `${campaignId}/${folder}/${safeFileName}`

            await this.b2.uploadFile({
                uploadUrl: uploadUrlData.data.uploadUrl,
                uploadAuthToken: uploadUrlData.data.authorizationToken,
                fileName,
                data: file.buffer,
            })

        } catch (error) {
            throw new InternalServerErrorException('Error uploading file')
        }

    }

    async deleteFolder(campaignId: string, folderName: string){
        try{

            const safeFolderName = this.sanitizeFolderName(folderName)

            // autoriza, no necesita url
            await this.b2.authorize()

            const prefix = `${campaignId}/${safeFolderName}/`
            
            let nextFileName: string | undefined

            do {

                const response = await this.b2.listFileNames({
                    bucketId: this.configService.get<string>('B2_BUCKET_ID'),
                    prefix,
                    startFileName: nextFileName,
                })

                for (const file of response.data.files){
                    await this.b2.deleteFileVersion({
                        fileId: file.fileId,
                        fileName: file.fileName
                    })
                }

                nextFileName = response.data.nextFileName

            } while (nextFileName)

        } catch (error) {
            throw new InternalServerErrorException('Error eliminating folder')
        }

    }

    async deleteFile(campaignId: string, folderName: string, fileName: string){

        try {

            const safeFolderName = this.sanitizeFolderName(folderName)
            const safeFileName = this.sanitizeFileName(fileName)

            await this.b2.authorize()

            const fullPath = `${campaignId}/${safeFolderName}/${safeFileName}`

            const response = await this.b2.listFileNames({
                bucketId: this.configService.get<string>('B2_BUCKET_ID'),
                prefix: fullPath,
                maxFileCount: 1,
            })

            if(!response.data.files.length){
                throw new BadRequestException('File not found')
            }

            const file = response.data.files[0]

            await this.b2.deleteFileVersion({
                fileId: file.fileId,
                fileName: file.fileName,
            })

        } catch (error) {
            if (error instanceof BadRequestException) { // querria decir que no se encontro el archivo
                throw error;
            }
            throw new InternalServerErrorException('Error eliminating file')
        }



    }

    async deleteCampaignFiles(campaignId: string){

    }

    // envia una lista con nombre del archivo y su id
    async listCompendiumFiles(campaignId: string): Promise<{name: string, fileId: string}[]> {
        
        await this.b2.authorize()

        const prefix = `${campaignId}/compendium/`
        let nextFileName: string | undefined
        const files: {name: string, fileId: string}[] = []

        const ignoredEndings  = ['.keep', '.bzEmpty'];

        do {
            const response = await this.b2.listFileNames({
                bucketId: this.configService.get<string>('B2_BUCKET_ID'),
                prefix,
                startFileName: nextFileName,
            })

            for (const file of response.data.files) {
                const relativeName = file.fileName.replace(prefix, '')

                // se evita este (.keep o .bzEmpty) archivo base que es para crear la estructura al principio
                if (ignoredEndings.some(ending => relativeName.endsWith(ending))) continue;

                files.push({
                    name: relativeName,
                    fileId: file.fileId,
                })
            }
        } while (nextFileName)

        return files

    }

}
