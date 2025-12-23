import { IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    auth0_id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    email: string

}