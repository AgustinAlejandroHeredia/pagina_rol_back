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
import { MapelemModule } from './mapelem/mapelem.module';
import { UserModule } from './user/user.module';
import { InviteModule } from './invite/invite.module';

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
    MapelemModule,
    UserModule,
    InviteModule,

  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
