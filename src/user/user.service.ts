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



    async getUserByMongoId(mongo_id: string) {
        return this.userModel
            .findById(mongo_id)
    }



    async findOrCreateUser(
        auth0_id: string,
        name: string,
        email: string,
    ) {
        return this.userModel.findOneAndUpdate(
            { auth0_id },
            {
            $setOnInsert: {
                auth0_id,
                name,
                email,
            },
            },
            {
            upsert: true,
            new: true,
            },
        ).exec();
    }



    async getUserByAuth0Id(auth0_id: string) {
        return this.userModel
            .findOne({ auth0_id })
            .lean()
            .exec()
    }



    async userEmailExists(email: string) {
        return this.userModel
            .findOne({ email })
            .lean()
            .exec()
    }



    // ADMIN

    async getUsersAsAdmin() {
        return this.userModel
            .find({}, { _id: 0, auth0_id: 0 })
            .lean()
            .exec()
    }



    async deleteUserAsAdmin(email: string) {
        console.log("-- NOT IMPLEMENTED YET --")
    }

}
