export class CreateProjectFolderDto {
  name!: string;
  parentId?: string | null;
}

export class UpdateProjectFolderDto {
  name!: string;
}
