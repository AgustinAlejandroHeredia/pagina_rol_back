import { Injectable, InternalServerErrorException } from '@nestjs/common';

// DTOs
import { FileMongoDto } from './dto/file-mongo.dto';
import { UpdateFileMongoDto } from './dto/update-file-mongo.dto';

// MONGOOSE
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { FileMongo, FileMongoSchema } from 'src/schemas/FileMongo.schema';

@Injectable()
export class FileMongoRegService {

    constructor(
        @InjectModel(FileMongo.name) private fileMongoModel: Model<FileMongo>,
    ){}

    async createFileMongo(fileId: string){
        try {

            console.log("Creating mongo file reg...")
            const fileData : FileMongoDto = {
                file_id: fileId,
                visibility: false,
            }

            const newFileMongo = new this.fileMongoModel(fileData)
            return newFileMongo.save()

        } catch (error) {
            throw new InternalServerErrorException('Error creating the mongo file reg')
        }
    }

    async updateFileView(fileId: string, updateData: UpdateFileMongoDto){
        
        if(updateData.visibility){
            updateData.visibility = false
        }else{
            updateData.visibility = true
        }
        
        return this.fileMongoModel.findOneAndUpdate(
            {file_id: fileId},
            {$set: updateData},
            {new: true}
        ).lean()
    }

    async deleteFileMongo(fileId: string){
        return this.fileMongoModel.findOneAndDelete(
            {file_id: fileId}
        ).lean()
    }

    private async createMissingRegs(fileIds: string[]): Promise<void> {
        const docs = fileIds.map(id => ({
            file_id: id,
            visibility: false,
        }))

        await this.fileMongoModel.insertMany(docs, { ordered: false })
    }

    async getVisibilities(fileIds: string[]): Promise<Map<string, boolean>> {

        const existing = await this.fileMongoModel
            .find({ file_id: { $in: fileIds } })
            .lean()

        const visibilityMap = new Map<string, boolean>(
            existing.map(f => [f.file_id, f.visibility])
        )

        const missingIds = fileIds.filter(id => !visibilityMap.has(id))

        if (missingIds.length > 0) {
            // fire & forget
            this.createMissingRegs(missingIds)
                .catch(err => {
                    // logueás, pero NO rompés el flujo
                    console.error('[FileMongo] Error creating missing regs:', err)
                })

            // asumimos default
            for (const id of missingIds) {
                visibilityMap.set(id, false)
            }
        }

        return visibilityMap
    }

}
