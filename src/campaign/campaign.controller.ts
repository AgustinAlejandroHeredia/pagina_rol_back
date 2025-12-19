import { Body, Controller, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { CreateCampaignDto } from './dto/create-campaign.dto';

// SWAGGER
import { ApiBody } from '@nestjs/swagger';

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Post()
    @ApiBody({ type: CreateCampaignDto })
    async createCampaign(@Body() createData: CreateCampaignDto ) {
        console.log('BODY DE CREATE CAMPAIGN -> ', createData)
        return this.campaignService.createCampaign(createData)
    }


}
