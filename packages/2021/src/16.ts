import { AoC } from 'aocf';

export interface BasePacket {
  v: number;
  t: number;
}
export interface PacketLiteral extends BasePacket {
  type: 'literal';
  value: number;
}
export interface PacketOperator extends BasePacket {
  type: 'operator';
  packets: Packet[];
}
export type Packet = PacketLiteral | PacketOperator;

export type Input = Packet;

const aoc = AoC.create<Input>(2021, 16);

aoc.parse = (l: string): Input => {
  return parsePacket(
    l
      .split('')
      .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
      .join(''),
  ).packet;
};

function parsePacket(input: string, offset = 0): { offset: number; packet: Packet } {
  const v = parseInt(input.slice(offset, offset + 3), 2);
  offset += 3;
  const t = parseInt(input.slice(offset, offset + 3), 2);
  offset += 3;

  if (t == 4) {
    const bits: string[] = [];
    while (true) {
      const isLast = input[offset] === '0';
      offset++;
      bits.push(input.slice(offset, offset + 4));
      offset += 4;
      if (isLast) break;
    }

    return { offset, packet: { t, v, type: 'literal', value: parseInt(bits.join(''), 2) } };
  }

  const isSubPacket = input[offset] == '1';
  offset += 1;
  if (isSubPacket) {
    const subPacketCount = parseInt(input.slice(offset, offset + 11), 2);
    offset += 11;
    const packets: Packet[] = [];
    for (let i = 0; i < subPacketCount; i++) {
      const res = parsePacket(input, offset);
      offset = res.offset;
      packets.push(res.packet);
    }
    return { offset, packet: { t, v, type: 'operator', packets } };
  }

  const subPacketCountBits = parseInt(input.slice(offset, offset + 15), 2);
  offset += 15;

  const targetOffset = offset + subPacketCountBits;
  const packets: Packet[] = [];
  while (offset < targetOffset) {
    const res = parsePacket(input, offset);
    offset = res.offset;
    packets.push(res.packet);
  }

  return { offset, packet: { t, v, type: 'operator', packets } };
}

aoc.partA = (input: Input): number => {
  function countVersion(pkt: Packet): number {
    if (pkt.type === 'literal') return pkt.v;
    if (pkt.type === 'operator') {
      let total = pkt.v;
      for (const p of pkt.packets) total += countVersion(p);
      return total;
    }
    throw new Error('Unk?');
  }

  return countVersion(input);
};
aoc.partB = (input: Input): number => {
  function compute(pkt: Packet): number {
    if (pkt.type === 'literal') return pkt.value;
    if (pkt.t === 0) return pkt.packets.reduce((v, current) => v + compute(current), 0);
    if (pkt.t === 1) return pkt.packets.reduce((v, current) => v * compute(current), 1);
    if (pkt.t === 2) return pkt.packets.reduce((v, current) => Math.min(v, compute(current)), Number.MAX_VALUE);
    if (pkt.t === 3) return pkt.packets.reduce((v, current) => Math.max(v, compute(current)), Number.MIN_VALUE);
    if (pkt.t === 5) return compute(pkt.packets[0]) > compute(pkt.packets[1]) ? 1 : 0;
    if (pkt.t === 6) return compute(pkt.packets[0]) < compute(pkt.packets[1]) ? 1 : 0;
    if (pkt.t === 7) return compute(pkt.packets[0]) == compute(pkt.packets[1]) ? 1 : 0;
    throw new Error('Unknown packet type: ' + pkt.t);
  }
  return compute(input);
};

aoc.test();
