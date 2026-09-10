import type {
  NetworkModule
} from "../networkModule";

import type {
  CtoCapacity
} from "./ctoTypes";

export interface CTO extends NetworkModule {

  capacity: CtoCapacity;

  occupiedPorts: number;

}
