import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SWAGGER
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() createData: CreateUserDto){
        console.log('BODY DE CREATE USER -> ', createData)
        return this.userService.createUser(createData)
    }

}
