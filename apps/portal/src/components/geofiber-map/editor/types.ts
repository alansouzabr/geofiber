export type Tool =
  | "select"
  | "hand"
  | "measure"
  | "add_pole"
  | "add_cto"
  | "add_splice"
  | "add_drop"
  | "add_customer"
  | "add_note"
  | "add_rack"
  | "add_duct"
  | "add_reserve"
  | "draw_fiber";

export type PaletteGroup =
  | "poles"
  | "ctos"
  | "splice"
  | "fiber"
  | "customers"
  | "notes"
  | "racks"
  | "ducts"
  | "reserves";

export type FeatureType =
  | "pole"
  | "cto"
  | "splice_box"
  | "fiber"
  | "customer"
  | "note"
  | "rack"
  | "duct"
  | "reserve";

export type FeatureBase = {
  id: string;
  type: FeatureType;
  name?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  notes?: string;
  folderId?: string | null;
  visible?: boolean;
  color?: string;
};

export type PointFeature = FeatureBase & {
  type: "pole" | "cto" | "splice_box" | "customer" | "note" | "rack" | "duct" | "reserve";
  lat: number;
  lng: number;
  iconKey: string;
};

export type LineFeature = FeatureBase & {
  type: "fiber";
  path: Array<{ lat: number; lng: number }>;
  styleKey: string;
};

export type Feature = PointFeature | LineFeature;
