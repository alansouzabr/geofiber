import {
  IsOptional,
  IsString
} from 'class-validator';


export class CreateChecklistExecutionDto {

  @IsString()
  templateId!: string;


  @IsOptional()
  @IsString()
  technicianProfileId?: string;


  @IsOptional()
  @IsString()
  notes?: string;

}
