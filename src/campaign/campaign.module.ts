import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';

@Module({

  imports: [MongooseModule.forFeature([{
    name: Campaign.name,
    schema: CampaignSchema,
  }])],

  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],

})

export class CampaignModule {}
