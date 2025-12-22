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

    async getUserByMongoId(mongo_id: string) {
        return this.userModel
            .findById(mongo_id)
    }

    async getUserByAuth0Id(auth0_id: string) {
        return this.userModel
            .findOne({ auth0_id })
            .lean()
            .exec()
    }

}
