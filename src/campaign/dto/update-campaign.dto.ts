import { IsString } from "class-validator";

export class UpdateCampaignDto {

    @IsString()
    name: string

    @IsString()
    description: string

    @IsString()
    system: string

}