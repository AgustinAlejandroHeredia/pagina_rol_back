import { Module } from '@nestjs/common';
import { FileMongoRegController } from './filemongoreg.controller';
import { FileMongoRegService } from './filemongoreg.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileMongo, FileMongoSchema } from 'src/schemas/FileMongo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: FileMongo.name, schema: FileMongoSchema}
    ])
  ],
  controllers: [FileMongoRegController],
  providers: [FileMongoRegService],
  exports: [FileMongoRegService],
})

export class FileMongoRegModule {}
