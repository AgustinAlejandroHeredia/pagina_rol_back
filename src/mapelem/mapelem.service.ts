import { Injectable } from '@nestjs/common';

// DTOs
import { CreateMapElemDto } from './dto/create-mapelem.dto';

// MONGOOSE
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { MapElem, MapElemSchema } from 'src/schemas/MapElem.schema';
import { ReturningStatementNotSupportedError } from 'typeorm';

@Injectable()
export class MapelemService {

    constructor(@InjectModel(MapElem.name) private mapElemModel: Model<MapElem>){}

    async createMapElem(createMapElemDto: CreateMapElemDto){
        const newMapElem = new this.mapElemModel(createMapElemDto)
        return newMapElem.save()
    }

}
