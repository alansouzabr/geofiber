import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString
} from "class-validator";

import { TechnicianSpecialty } from "@prisma/client";

export class CreateFieldTechnicianDto {

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  cboCode?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnicianSpecialty, { each: true })
  specialties?: TechnicianSpecialty[];

}
