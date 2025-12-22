import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CampaignUserDto {

    // DTO para la transaccion del tipo especifico que tiene en el listado de usuarios (campaing.users[])

    @IsMongoId()
    mongo_id: string;

    @IsString()
    @IsNotEmpty()
    auth0_id: string;

    @IsString()
    alias: string;
}
