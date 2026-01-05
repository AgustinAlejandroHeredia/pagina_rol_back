import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

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
            throw new BadRequestException('File name is required')
        }

        // Decode por si viene URL-encoded
        let decoded = decodeURIComponent(fileName).trim()

        // No permitir rutas
        if (decoded.includes('/') || decoded.includes('\\')) {
            throw new BadRequestException(
                'Invalid file name. Path separators are not allowed'
            )
        }

        // COLAPSAR EXTENSIONES DUPLICADAS (.pdf.pdf → .pdf)
        decoded = decoded.replace(/(\.[a-zA-Z0-9]+)\1+$/, '$1')

        const lastDotIndex = decoded.lastIndexOf('.')
        if (lastDotIndex === -1) {
            throw new BadRequestException('File extension is required')
        }

        const rawName = decoded.slice(0, lastDotIndex)
        const rawExt = decoded.slice(lastDotIndex + 1)

        // Sanitizar nombre
        const safeName = rawName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9._-]/g, '')

        // Sanitizar extensión
        const safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '')

        if (!safeName || !safeExt) {
            throw new BadRequestException('Invalid file name')
        }

        return `${safeName}.${safeExt}`
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

            const fileName = `${campaignId}/compendium/${safeFolderName}/.keep`

            await this.b2.uploadFile({
                uploadUrl: uploadUrlData.data.uploadUrl,
                uploadAuthToken: uploadUrlData.data.authorizationToken,
                fileName,
                data: Buffer.alloc(0)
            })

        } catch (error) {
            console.error('CREATE FOLDER ERROR : ', error);
            throw new InternalServerErrorException('Error new creating the campaign folder')
        }
    }

    // Se sube un archivo indicando campaña y carpeta de compendium
    async uploadFiles(files: Express.Multer.File[], campaignId: string, folder: string) {
        if (!files || files.length === 0) return

        const filesArray = Array.isArray(files) ? files : [files]

        try {
            const uploadUrlData = await this.getAuthorizedUploadUrl()

            await Promise.all(
                filesArray.map(async (file) => {
                    const safeFileName = this.sanitizeFileName(file.originalname)

                    // Determinar la ruta final
                    let filePath = `${campaignId}/compendium/`
                    if (folder && folder !== 'root') {
                        filePath += `${folder}/`
                    }
                    filePath += safeFileName

                    await this.b2.uploadFile({
                        uploadUrl: uploadUrlData.data.uploadUrl,
                        uploadAuthToken: uploadUrlData.data.authorizationToken,
                        fileName: filePath,
                        data: file.buffer,
                    })
                })
            )
            console.log(" FILE UPLOADED ")
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Error uploading files')
        }
    }

    async deleteFolder(campaignId: string, folderName: string){
        try{

            const safeFolderName = this.sanitizeFolderName(folderName)

            // autoriza, no necesita url
            await this.b2.authorize()

            const prefix = `${campaignId}/compendium/${safeFolderName}/`
            
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

    async deleteFile(fileId: string): Promise<void> {
        try {
            if (!fileId) {
                throw new BadRequestException('File id is required');
            }

            await this.b2.authorize();

            // Primero obtenemos info del archivo para saber el fileName
            const fileInfo = await this.b2.getFileInfo({ fileId });

            await this.b2.deleteFileVersion({
                fileId,
                fileName: fileInfo.data.fileName,
            });

        } catch (error) {
            console.error('Error deleting file:', error);
            throw new InternalServerErrorException('Error deleting file');
        }
    }

    // envia una lista con nombre del archivo y su id
    async listCompendiumFiles(
        campaignId: string
    ): Promise<{ name: string; fileId: string | null }[]> {

        await this.b2.authorize()

        const prefix = `${campaignId}/compendium/`
        let nextFileName: string | undefined

        const files: { name: string; fileId: string | null }[] = []

        do {
            const response = await this.b2.listFileNames({
            bucketId: this.configService.get<string>('B2_BUCKET_ID'),
            prefix,
            startFileName: nextFileName,
            })

            for (const file of response.data.files) {
            const relativeName = file.fileName.replace(prefix, '')

            // ignoromos infraestructura
            if (relativeName === '.keep') continue
            if (relativeName.endsWith('.bzEmpty')) continue

            files.push({
                name: relativeName,          // Example/.keep | mapa.jpg
                fileId: file.fileId ?? null,
            })
            }

            nextFileName = response.data.nextFileName
        } while (nextFileName)

        return files
    }

    async getFileById(fileId: string): Promise<{
        data: Buffer
        fileName: string
        contentType: string
    }>{
        try {

            await this.b2.authorize()

            const fileInfo = await this.b2.getFileInfo({ fileId })

            if (!fileInfo?.data) {
                throw new NotFoundException('File not found')
            }

            const { fileName, contentType } = fileInfo.data

            const downloadResponse = await this.b2.downloadFileById({
                fileId,
                responseType: 'arraybuffer',
            })

            return {
                data: Buffer.from(downloadResponse.data),
                fileName,
                contentType: contentType || 'application/octet-stream'
            }

        } catch (error) {
            throw new InternalServerErrorException('Error downloading file')
        }
    }

}
