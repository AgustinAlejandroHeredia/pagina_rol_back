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



    // NEW
    async userEmailExists(email: string){
        return this.userModel.findOne({ email }).exec()
    }



    // NEW
    async userAuth0EmailExists(userId: string, email: string){
        return this.userModel.findOne({
            auth0_id: userId,
            email: email,
        }).exec()
    }



    // NEW
    async createNewUser(auth0_id: string, name: string, email: string) {
        const newUser = new this.userModel({
            auth0_id,
            name,
            email,
        })
        return newUser.save()
    }



    // NEW
    async linkAccounts() {

    }



    async findOrCreateUser(
        auth0_id: string,
        name: string,
        email: string,
    ) {
        const result = this.userEmailExists(email)
        if(!result){
            this.createNewUser(auth0_id, name, email)
        }else{
            return 
        }
    }



    async getUserByAuth0Id(auth0_id: string) {
        return this.userModel
            .findOne({ auth0_id })
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
