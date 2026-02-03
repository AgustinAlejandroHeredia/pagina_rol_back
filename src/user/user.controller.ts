import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SWAGGER
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

// PERMISSIONS, DECORATORS, GUARDS
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { User } from 'src/auth/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {



    constructor(private readonly userService: UserService) {}



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post("/userExists")
    async userExists(
        @User('userId') userId: string,
        @Body() body: { name: string, email: string }
    ) {

        if(!body.name.trim() || !body.email.trim()){
            throw new BadRequestException("Faltan uno o mas campos requeridos (name: string, email: string)")
        }

        await this.userService.findOrCreateUser(
            userId,
            body.name,
            body.email,
        )

        return { ok: true }
    }



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get("/userEmailExists/:email")
    async userEmailExists(
        @Param('email') email: string,
    ){
        return await this.userService.userEmailExists(email)
    }



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Get("/userAuth0EmailExists/:email")
    async userAuth0EmailExists(
        @User('userId') userId: string,
        @Param('email') email: string,
    ){
        return await this.userService.userAuth0EmailExists(userId, email)
    }



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('read:campaign')
    @Post("/createNewUser")
    async createNewUser(
        @User('userId') userId: string,
        @Body() body: { name: string, email: string }
    ){
        await this.userService.createNewUser(userId, body.name, body.email)
    }



    // ADMIN

    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('admin:page')
    @Get("/admin/getUsersAsAdmin")
    async getUsersAsAdmin(){
        const result = await this.userService.getUsersAsAdmin()
        console.log("USERS AS ADMIN : ", result)
        return result
    }



    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @Permissions('admin:page')
    @Delete("admin/deleteUserAsAdmin/:email")
    async deleteUserAsAdmin(
        @Param('email') email: string
    ){
        await this.userService.deleteUserAsAdmin(email)
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
