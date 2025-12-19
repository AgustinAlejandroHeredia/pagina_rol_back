import { Global, Module } from '@nestjs/common';

// Config
import { ConfigModule, ConfigService } from "@nestjs/config";

// Mongo
import { MongoClient, Db } from 'mongodb';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<Db> => {
                const uri = configService.get<string>('MONGO_ATLAS_URL')
                const client = new MongoClient(uri!)
                await client.connect() // se conecta al cluster
                console.log('✅ Conectado a MongoDB')
                return client.db()
            }
        }
    ],
    exports: ['DATABASE_CONNECTION']
})
export class DbModule {}
