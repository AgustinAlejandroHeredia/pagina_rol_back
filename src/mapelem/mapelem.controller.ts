import { Controller, Post, Body } from '@nestjs/common';
import { MapelemService } from './mapelem.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';
import { CreateMapElemDto } from './dto/create-mapelem.dto';

// SWAGGER
import { ApiBody } from '@nestjs/swagger';

@Controller('mapelem')
export class MapelemController {
    constructor(private readonly mapElemService: MapelemService) {}

    @Post()
    @ApiBody({ type: CreateMapElemDto })
    async createMapElem(@Body() createData: CreateMapElemDto){
        console.log('BODY DE CREATE MAPELEM -> ', createData)
        return this.mapElemService.createMapElem(createData)
    }

}
