import { Injectable, InternalServerErrorException } from '@nestjs/common';

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

        let pictureId = ''
        
        // BACKBLAZE
        if(file){
            pictureId = await this.backblazeService.uploadMapElemPicture(campaignId, file)
        }

        // MONGO DB
        const newMapElem = new this.mapElemModel({
            ...createMapElemDto,
            pictureId,
            campaignId: new Types.ObjectId(campaignId)
        })

        console.log("CREATE MAP ELEM RESULT : ", newMapElem)
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
        const result = await this.mapElemModel.findByIdAndUpdate(
            mapElemId,
            {$set: updateData},
            {new: true},
        ).lean()
        console.log("RESULTADO updateMapElem : ", JSON.stringify(result, null, 2))
    }



    async deleteMapElem(mapElemId: string, pictureId: string){
        const deletedElem = this.mapElemModel.findByIdAndDelete(mapElemId).lean()

        if(!pictureId?.trim()){
            return deletedElem
        }

        console.log("RESULTADO deleteMapElem : ", JSON.stringify(deletedElem, null, 2))

        try {
            await this.backblazeService.deleteFile(pictureId)
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Error deleting map elem data from file storage')
        }
    }

}
