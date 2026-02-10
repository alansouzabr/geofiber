import { IsBoolean, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export enum SignalMode {
  STATIC = 'STATIC',
  RANDOM_WALK = 'RANDOM_WALK',
}

export class UpdateFiberSignalConfigDto {
  @IsOptional() @IsBoolean()
  enabled?: boolean;

  @IsOptional() @IsEnum(SignalMode)
  mode?: SignalMode;

  @IsOptional() @IsNumber() @Min(-60) @Max(20)
  targetTxDbm?: number;

  @IsOptional() @IsNumber() @Min(-60) @Max(20)
  targetRxDbm?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(40)
  attenuationDb?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(20)
  noiseDb?: number;

  @IsOptional() @IsNumber() @Min(1) @Max(500)
  steps?: number;
}

export class TickDto {
  @IsOptional() @IsNumber() @Min(1) @Max(500)
  count?: number;
}
