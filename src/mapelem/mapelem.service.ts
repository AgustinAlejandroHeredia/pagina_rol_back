import { Injectable } from '@nestjs/common';

// DTOs
import { CreateMapElemDto } from './dto/create-mapelem.dto';

// MONGOOSE
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { MapElem, MapElemSchema } from 'src/schemas/MapElem.schema';
import { ReturningStatementNotSupportedError } from 'typeorm';
import { UpdateMapElemDto } from './dto/update-mapelem.dto';

// BACKBLAZE
import { BackblazeService } from 'src/backblaze/backblaze.service';

@Injectable()
export class MapelemService {

    constructor(
        @InjectModel(MapElem.name) private mapElemModel: Model<MapElem>,
        private readonly backblazeService: BackblazeService,
    ){}

    async createMapElem(createMapElemDto: CreateMapElemDto, campaignId:string, file: Express.Multer.File){

        // BACKBLAZE
        const pictureId = await this.backblazeService.uploadMapElemPicture(campaignId, file)

        // MONGO DB
        const newMapElem = new this.mapElemModel({
            ...createMapElemDto,
            pictureId,
            campaignId: new Types.ObjectId(campaignId)
        })

        return newMapElem.save()
    }

    async getMapsElemsByCampaignIdAndLayer(campaignId: string, layer: number){
        return this.mapElemModel
            .find(
                { 
                    "campaignId": new Types.ObjectId(campaignId),
                    "layer": layer
                }
            )
            .lean()
    }

    async updateMapElem(mapElemId: string, updateData: UpdateMapElemDto){
        return this.mapElemModel.findByIdAndUpdate(
            mapElemId,
            {$set: updateData},
            {new: true},
        ).lean()
    }

    async deleteMapElem(mapElemId: string, pictureId: string){
        const deletedElem = this.mapElemModel.findByIdAndDelete(mapElemId).lean()

        if(!pictureId?.trim()){
            return deletedElem
        }

        await this.backblazeService.deleteFile(pictureId)

        return deletedElem
    }

}
