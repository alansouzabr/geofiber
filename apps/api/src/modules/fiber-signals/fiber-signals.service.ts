import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignalMode, TickDto, UpdateFiberSignalConfigDto } from './dto';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

@Injectable()
export class FiberSignalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(companyId: string, rackEquipmentId: string) {
    const eq = await this.prisma.rackEquipment.findFirst({
      where: { id: rackEquipmentId, companyId },
      select: { id: true },
    });
    if (!eq) throw new NotFoundException('RackEquipment não encontrado');

    const existing = await this.prisma.fiberSignal.findFirst({
      where: { companyId, rackEquipmentId },
    });
    if (existing) return existing;

    return this.prisma.fiberSignal.create({
      data: {
        companyId,
        rackEquipmentId,
        enabled: true,
        mode: 'RANDOM_WALK',
        targetTxDbm: 0,
        targetRxDbm: -20,
        attenuationDb: 0,
        noiseDb: 0,
        steps: 20,
        txDbm: 0,
        rxDbm: -20,
      },
    });
  }

  async updateConfig(companyId: string, rackEquipmentId: string, dto: UpdateFiberSignalConfigDto) {
    const s = await this.getOrCreate(companyId, rackEquipmentId);

    return this.prisma.fiberSignal.update({
      where: { id: s.id },
      data: {
        enabled: dto.enabled ?? s.enabled,
        mode: (dto.mode as any) ?? s.mode,
        targetTxDbm: dto.targetTxDbm ?? s.targetTxDbm,
        targetRxDbm: dto.targetRxDbm ?? s.targetRxDbm,
        attenuationDb: dto.attenuationDb ?? s.attenuationDb,
        noiseDb: dto.noiseDb ?? s.noiseDb,
        steps: dto.steps ?? s.steps,
      },
    });
  }

  private nextState(s: any) {
    if (s.mode === SignalMode.STATIC) {
      const tx = clamp(
        s.targetTxDbm - s.attenuationDb + randBetween(-s.noiseDb, s.noiseDb),
        -60, 20,
      );
      const rx = clamp(
        s.targetRxDbm - s.attenuationDb + randBetween(-s.noiseDb, s.noiseDb),
        -60, 20,
      );
      return { txDbm: tx, rxDbm: rx };
    }

    const step = Math.max(1, Number(s.steps ?? 20));
    const txDelta = (s.targetTxDbm - s.txDbm) / step;
    const rxDelta = (s.targetRxDbm - s.rxDbm) / step;

    const tx = clamp(
      s.txDbm + txDelta + randBetween(-s.noiseDb, s.noiseDb) - (s.attenuationDb * 0.02),
      -60, 20,
    );
    const rx = clamp(
      s.rxDbm + rxDelta + randBetween(-s.noiseDb, s.noiseDb) - (s.attenuationDb * 0.02),
      -60, 20,
    );

    return { txDbm: tx, rxDbm: rx };
  }

  async tick(companyId: string, rackEquipmentId: string, dto: TickDto) {
    const s = await this.getOrCreate(companyId, rackEquipmentId);
    if (!s.enabled) return s;

    const count = clamp(Number(dto.count ?? 1), 1, 500);

    let tx = s.txDbm;
    let rx = s.rxDbm;

    for (let i = 0; i < count; i++) {
      const next = this.nextState({ ...s, txDbm: tx, rxDbm: rx });
      tx = next.txDbm;
      rx = next.rxDbm;
    }

    return this.prisma.fiberSignal.update({
      where: { id: s.id },
      data: { txDbm: tx, rxDbm: rx },
    });
  }
}
