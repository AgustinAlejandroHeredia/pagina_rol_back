import { Injectable } from '@nestjs/common';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';

// MONGOOSE
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { User, UserSchema } from 'src/schemas/User.schema';
import { ReturningStatementNotSupportedError } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async createUser(createUserDto: CreateUserDto){
        const newUser = new this.userModel(createUserDto)
        return newUser.save()
    }

}
