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

@Injectable()
export class MapelemService {

    constructor(@InjectModel(MapElem.name) private mapElemModel: Model<MapElem>){}

    async createMapElem(createMapElemDto: CreateMapElemDto, campaignId:string){
        const newMapElem = new this.mapElemModel({
            ...createMapElemDto,
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

}
