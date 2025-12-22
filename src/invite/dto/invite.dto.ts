import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class InviteDto {

    @IsMongoId()
    @IsNotEmpty()
    campaign_id: string

    // quien lo envia
    @IsMongoId()
    @IsNotEmpty()
    from_mongo_id: string

    // para quien es enviado
    @IsMongoId()
    @IsNotEmpty()
    for_mongo_id: string

    @IsDate()
    @IsNotEmpty()
    expires_at: Date

    @IsNotEmpty()
    token: string

}