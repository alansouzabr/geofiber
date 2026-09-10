import type {
  NetworkAsset
} from "./networkAsset";

import type {
  AssetType
} from "./assetTypes";

export function createNetworkAsset(

  id: string,

  name: string,

  type: AssetType,

  folderId?: string

): NetworkAsset {

  return {

    id,

    name,

    type,

    folderId,

    hidden: false

  };

}
