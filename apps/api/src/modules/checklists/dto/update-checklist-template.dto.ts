import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString
} from 'class-validator';

import {
  ChecklistTemplateItemInputDto
} from './create-checklist-template.dto';


export class UpdateChecklistTemplateDto {

  @IsOptional()
  @IsString()
  name?: string;


  @IsOptional()
  @IsString()
  description?: string | null;


  @IsOptional()
  @IsString()
  category?: string | null;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;


  @IsOptional()
  @IsArray()
  items?: ChecklistTemplateItemInputDto[];

}
