import type {
  NetworkModuleType
} from "./moduleTypes";

export interface NetworkModule {

  id: string;

  name: string;

  module: NetworkModuleType;

}
