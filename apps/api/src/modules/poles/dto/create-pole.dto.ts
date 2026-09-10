export class CreatePoleDto {
  name?: string;
  type?: string;

  lat!: number;
  lng!: number;

  address?: string | null;
  notes?: string | null;
  visible?: boolean;

  folderId?: string | null;
  projectId?: string;
}
