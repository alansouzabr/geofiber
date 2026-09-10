export type FolderKind =
  | "root"
  | "folder"
  | "subfolder"
  | "postes"
  | "dutos"
  | "cabos"
  | "reservas"
  | "caixas"
  | "cto"
  | "clientes"
  | "racks";

export type ProjectFolderNode = {
  id: string;
  parentId: string | null;
  kind: FolderKind;
  name: string;
  color?: string;
  visible: boolean;
  locked?: boolean;
  expanded?: boolean;
  sortOrder?: number;
};

export type MapFeatureType =
  | "pole"
  | "cto"
  | "splice_box"
  | "fiber"
  | "customer"
  | "note"
  | "rack"
  | "duct"
  | "reserve";

export type ProjectFeatureMeta = {
  folderId: string | null;
  visible: boolean;
  color?: string;
};

export type ProjectTreeState = {
  folders: ProjectFolderNode[];
};
