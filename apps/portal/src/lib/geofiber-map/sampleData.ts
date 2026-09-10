export type MapPoint = {
  id: string;
  name: string;
  kind: 'POP' | 'CTO' | 'POSTE' | 'CLIENTE';
  lat: number;
  lng: number;
};

export type FiberRoute = {
  id: string;
  name: string;
  path: Array<[number, number]>;
};

export const defaultCenter: [number, number] = [-23.6915, -46.5646]; // SBC/SP (ajuste se quiser)
export const defaultZoom = 14;

export const points: MapPoint[] = [
  { id: 'pop-01', name: 'POP Central', kind: 'POP', lat: -23.6909, lng: -46.5643 },
  { id: 'cto-01', name: 'CTO 01 - Rua A', kind: 'CTO', lat: -23.6932, lng: -46.5631 },
  { id: 'cto-02', name: 'CTO 02 - Rua B', kind: 'CTO', lat: -23.6889, lng: -46.5675 },
];

export const fiberRoutes: FiberRoute[] = [
  {
    id: 'fibra-01',
    name: 'Backbone 01',
    path: [
      [-23.6909, -46.5643], // POP
      [-23.6916, -46.5639],
      [-23.6922, -46.5635],
      [-23.6932, -46.5631], // CTO 01
    ],
  },
];
