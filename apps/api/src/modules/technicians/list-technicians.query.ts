import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTechniciansQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value; // "banana" -> IsBoolean reprova
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 1 : Number(value)))
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 20 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}
