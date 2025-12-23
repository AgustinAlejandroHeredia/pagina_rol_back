import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SWAGGER
import { ApiBody, ApiTags } from '@nestjs/swagger';

// PERMISSIONS, DECORATORS, GUARDS
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() createData: CreateUserDto){
        console.log('BODY DE CREATE USER -> ', createData)
        return this.userService.createUser(createData)
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get("/userExists")
    async userExists(@User('userId') userId: string) {
        const result = await this.userService.getUserByAuth0Id(userId)
        if(!result){
            return false
        }
        return true
    }

    // Elimino estos endpoints por ahora

    /*
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('by-mongo/:mongo_id')
    async getUserByMongoId(@Param('mongo_id') mongo_id: string) {
        const result = await this.userService.getUserByMongoId(mongo_id)
        console.log("RESULTADO getUserByMongoId : ", JSON.stringify(result, null, 2))
        return result
    }

    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get('by-auth0/:auth0_id')
    async getUserByAuth0Id(@Param('auth0_id') auth0_id: string) {
        const result = await this.userService.getUserByAuth0Id(auth0_id)
        console.log("RESULTADO getUserByAuth0Id : ", JSON.stringify(result, null, 2))
        return result
    }
    */

}
