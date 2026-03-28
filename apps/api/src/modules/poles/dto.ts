export class CreatePoleDto {
  lat!: number;
  lng!: number;
  name?: string;
  address?: string | null;
  notes?: string | null;
  folderId?: string | null;
  visible?: boolean;
}

export class UpdatePoleDto {
  lat?: number;
  lng?: number;
  name?: string;
  address?: string | null;
  notes?: string | null;
  folderId?: string | null;
  visible?: boolean;
}
