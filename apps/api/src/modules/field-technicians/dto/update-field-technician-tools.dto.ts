import {
  IsArray
} from "class-validator";


/*
 * ETAPA32G_TOOLS_DTO
 *
 * O formato interno dos objetos é
 * versionado pela interface frontend.
 *
 * O Prisma já possui:
 *
 * FieldTechnicianProfile.tools Json?
 */
export class UpdateFieldTechnicianToolsDto {

  @IsArray()
  tools!: any[];

}
