import { apiFetch } from './api';
import type { Project } from './types';

export type Station = { id: string; name: string; type: string; projectId: string };
export type Rack = { id: string; name: string; stationId: string };
export type RackEquipment = { id: string; name: string; type: string; rackId: string };

export type FiberSignal = {
  id: string;
  rackEquipmentId: string;
  enabled: boolean;
  mode: 'STATIC' | 'RANDOM_WALK';
  targetTxDbm: number;
  targetRxDbm: number;
  attenuationDb: number;
  noiseDb: number;
  steps: number;
  txDbm: number;
  rxDbm: number;
  updatedAt: string;
};

export async function login(email: string, password: string) {
  const res = await apiFetch<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.accessToken;
}

export async function listProjects(): Promise<Project[]> {
  const res = await apiFetch<{ data: Project[] }>('/projects');
  return res.data;
}
export async function listStations(projectId: string): Promise<Station[]> {
  const res = await apiFetch<{ data: Station[] }>(`/stations?projectId=${encodeURIComponent(projectId)}`);
  return res.data;
}
export async function listRacks(stationId: string): Promise<Rack[]> {
  const res = await apiFetch<{ data: Rack[] }>(`/racks?stationId=${encodeURIComponent(stationId)}`);
  return res.data;
}
export async function listEquipments(rackId: string): Promise<RackEquipment[]> {
  const res = await apiFetch<{ data: RackEquipment[] }>(`/rack-equipments?rackId=${encodeURIComponent(rackId)}`);
  return res.data;
}
export async function getSignal(rackEquipmentId: string): Promise<FiberSignal> {
  const res = await apiFetch<{ data: FiberSignal }>(`/fiber-signals/equipment/${encodeURIComponent(rackEquipmentId)}`);
  return res.data;
}
export async function updateSignalConfig(rackEquipmentId: string, body: Partial<FiberSignal>): Promise<FiberSignal> {
  const res = await apiFetch<{ data: FiberSignal }>(
    `/fiber-signals/equipment/${encodeURIComponent(rackEquipmentId)}/config`,
    { method: 'POST', body: JSON.stringify(body) },
  );
  return res.data;
}
export async function tickSignal(rackEquipmentId: string, count: number): Promise<FiberSignal> {
  const res = await apiFetch<{ data: FiberSignal }>(
    `/fiber-signals/equipment/${encodeURIComponent(rackEquipmentId)}/tick`,
    { method: 'POST', body: JSON.stringify({ count }) },
  );
  return res.data;
}
