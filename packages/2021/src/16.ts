import { AoC } from 'aocf';

export enum PacketType {
  Sum = 0,
  Product = 1,
  Min = 2,
  Max = 3,
  Literal = 4,
  GreaterThan = 5,
  LessThan = 6,
  Equal = 7,
}

export interface PacketLiteral {
  v: number;
  t: PacketType.Literal;
  value: number;
}
export interface PacketOperator {
  v: number;
  t: Exclude<PacketType, PacketType.Literal>;
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

  if (t == PacketType.Literal) {
    const bits: string[] = [];
    while (true) {
      const isLast = input[offset] === '0';
      bits.push(input.slice(offset + 1, offset + 5));
      offset += 5;
      if (isLast) break;
    }

    return { offset, packet: { t, v, value: parseInt(bits.join(''), 2) } };
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
    return { offset, packet: { t, v, packets } };
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

  return { offset, packet: { t, v, packets } };
}

aoc.partA = (input: Input): number => {
  function countVersion(pkt: Packet): number {
    if (pkt.t === PacketType.Literal) return pkt.v;
    return pkt.packets.reduce((v, c) => v + countVersion(c), pkt.v);
  }

  return countVersion(input);
};
aoc.partB = (input: Input): number => {
  function calc(pkt: Packet): number {
    if (pkt.t === PacketType.Literal) return pkt.value;
    const p = pkt.packets;
    if (pkt.t === PacketType.Sum) return p.reduce((v, current) => v + calc(current), 0);
    if (pkt.t === PacketType.Product) return p.reduce((v, current) => v * calc(current), 1);
    if (pkt.t === PacketType.Min) return p.reduce((v, current) => Math.min(v, calc(current)), Number.MAX_VALUE);
    if (pkt.t === PacketType.Max) return p.reduce((v, current) => Math.max(v, calc(current)), Number.MIN_VALUE);
    if (pkt.t === PacketType.GreaterThan) return calc(p[0]) > calc(p[1]) ? 1 : 0;
    if (pkt.t === PacketType.LessThan) return calc(p[0]) < calc(p[1]) ? 1 : 0;
    if (pkt.t === PacketType.Equal) return calc(p[0]) == calc(p[1]) ? 1 : 0;
    throw new Error('Unknown packet type: ' + pkt.t);
  }
  return calc(input);
};

aoc.test();
