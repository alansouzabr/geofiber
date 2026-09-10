export class CreatePoleAccessoryDto {

  poleId!: string;

  type!: string;

  name!: string;

  capacity?: number;

  occupiedPorts?: number;

  status?: string;

}
