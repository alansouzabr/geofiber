export class UpdatePoleDto {
  name?: string;
  lat?: number;
  lng?: number;

  address?: string | null;
  notes?: string | null;
  visible?: boolean;

  folderId?: string | null;
}
