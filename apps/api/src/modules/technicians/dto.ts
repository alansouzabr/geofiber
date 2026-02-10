import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum TechnicianSpecialty {
  TELEFONIA = 'TELEFONIA',
  REDE = 'REDE',
  TRANSMISSAO = 'TRANSMISSAO',
  FTTH = 'FTTH',
  FUSIONISTA = 'FUSIONISTA',
}

export class UpsertTechnicianProfileDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  cboCode?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TechnicianSpecialty, { each: true })
  specialties?: TechnicianSpecialty[];

  @IsOptional()
  @IsString()
  registration?: string;

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
  @IsBoolean()
  isActive?: boolean;
}

export class CreateTechnicianUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
