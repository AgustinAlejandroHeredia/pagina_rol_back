import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { CampaignModule } from './campaign/campaign.module';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose'

// CONFIG
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [

    ConfigModule.forRoot({ 
      envFilePath: '.env',
      isGlobal: true, 
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_ATLAS_URL')
      })
    }),
    
    AuthModule,
    DbModule,
    CampaignModule,

  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
