import {
  IsObject
} from "class-validator";


/*
 * ETAPA32H_VEHICLE_DTO
 *
 * Persistência:
 *
 * FieldTechnicianProfile.vehicle Json?
 *
 * Objeto vazio representa:
 *
 * nenhum veículo atribuído.
 */
export class UpdateFieldTechnicianVehicleDto {

  @IsObject()
  vehicle!: Record<string, any>;

}
