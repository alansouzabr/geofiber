import type {
  AssetType
} from "./assetTypes";

export interface NetworkAsset {

  id: string;

  name: string;

  type: AssetType;

  folderId?: string;

  hidden?: boolean;

}
