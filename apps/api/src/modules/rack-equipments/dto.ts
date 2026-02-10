export class CreateRackEquipmentDto {
  rackId!: string;
  name!: string;
  type!: string;
  vendor?: string;
  model?: string;
  serial?: string;
}

export class UpdateRackEquipmentDto {
  name?: string;
  type?: string;
  vendor?: string;
  model?: string;
  serial?: string;
}
