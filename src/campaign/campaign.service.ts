import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// DTOs
import { CreateCampaignDto } from './dto/create-campaign.dto';

// MONGOOSE
import { Model } from 'mongoose'

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';
import { ReturningStatementNotSupportedError } from 'typeorm'

@Injectable()
export class CampaignService {

    constructor(@InjectModel(Campaign.name) private campaignModel: Model<Campaign>){}

    async createCampaign(createCampaignDto: CreateCampaignDto){
        console.log('RECIBO ESTO EN SERVICE : ', createCampaignDto)
        const newCampaign = new this.campaignModel(createCampaignDto)
        console.log('CAMPAÑA NUEVA CREADA : ', newCampaign)
        return newCampaign.save()
    }

}
