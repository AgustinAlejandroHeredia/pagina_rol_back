import { Module } from '@nestjs/common';
import { MapelemController } from './mapelem.controller';
import { MapelemService } from './mapelem.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMAS
import { MapElem, MapElemSchema } from 'src/schemas/MapElem.schema';

@Module({

  imports: [MongooseModule.forFeature([{
    name: MapElem.name,
    schema: MapElemSchema,
  }])],

  controllers: [MapelemController],
  providers: [MapelemService]

})
export class MapelemModule {}
