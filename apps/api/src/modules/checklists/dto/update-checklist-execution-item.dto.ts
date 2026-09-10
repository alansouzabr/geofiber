import {
  IsOptional,
  IsString
} from 'class-validator';


export class UpdateChecklistExecutionItemDto {

  @IsOptional()
  response?: any;


  @IsOptional()
  @IsString()
  observation?: string | null;

}
