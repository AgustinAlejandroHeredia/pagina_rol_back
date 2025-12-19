import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMAS
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({

  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema,
  }])],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
