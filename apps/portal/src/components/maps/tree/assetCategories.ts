export const ASSET_CATEGORIES = {

  POLE: {
    label: "POSTES",
    rootNodeType: "ROOT_POSTES_CATEGORY",
    folderNodeType: "POSTES_CATEGORY"
  },

  FIBER: {
    label: "FIBRAS",
    rootNodeType: "ROOT_FIBRAS_CATEGORY",
    folderNodeType: "FIBRAS_CATEGORY"
  },

  STATION: {
    label: "ESTAÇÕES",
    rootNodeType: "ROOT_ESTACOES_CATEGORY",
    folderNodeType: "ESTACOES_CATEGORY"
  },

  RACK: {
    label: "RACKS",
    rootNodeType: "ROOT_RACKS_CATEGORY",
    folderNodeType: "RACKS_CATEGORY"
  },

  ACCESSORY: {
    label: "ACESSÓRIOS",
    rootNodeType: "ROOT_ACESSORIOS_CATEGORY",
    folderNodeType: "ACESSORIOS_CATEGORY"
  },

  OTDR: {
    label: "OTDR",
    rootNodeType: "ROOT_OTDR_CATEGORY",
    folderNodeType: "OTDR_CATEGORY"
  },

  GROUP: {
    label: "GRUPOS",
    rootNodeType: "ROOT_GRUPOS_CATEGORY",
    folderNodeType: "GRUPOS_CATEGORY"
  }

} as const;
