import {
  ChecklistItemType
} from '@prisma/client';

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString
} from 'class-validator';


export class ChecklistTemplateItemInputDto {

  @IsString()
  label!: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsEnum(
    ChecklistItemType
  )
  type!: ChecklistItemType;


  @IsOptional()
  @IsBoolean()
  required?: boolean;


  @IsOptional()
  options?: unknown;

}


export class CreateChecklistTemplateDto {

  @IsString()
  name!: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsString()
  category?: string;


  @IsArray()
  items!: ChecklistTemplateItemInputDto[];

}
