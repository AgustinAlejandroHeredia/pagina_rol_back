import { IsOptional, IsString } from "class-validator";

export class UpdateCampaignDto {

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    system?: string

    @IsOptional()
    @IsString()
    mapId?: string

}