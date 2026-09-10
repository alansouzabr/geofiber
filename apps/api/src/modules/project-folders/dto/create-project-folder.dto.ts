export class CreateProjectFolderDto {
  projectId!: string;

  parentId?: string | null;

  name!: string;

  nodeType!: string;
}
