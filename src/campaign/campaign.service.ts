import { Injectable } from '@nestjs/common';

// DTOs
import { CreateCampaignDto } from './dto/create-campaign.dto';

// MONGOOSE
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';
import { ReturningStatementNotSupportedError } from 'typeorm'

@Injectable()
export class CampaignService {

    constructor(@InjectModel(Campaign.name) private campaignModel: Model<Campaign>){}

    async createCampaign(createCampaignDto: CreateCampaignDto){
        // como default el schema inica la lista de usuarios vacia
        const newCampaign = new this.campaignModel(createCampaignDto)
        return newCampaign.save()
    }

}
