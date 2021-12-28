import { AoC } from 'aocf';

export type Input = Stats;

const aoc = AoC.create<Input>(2015, 22);

interface Stats {
  hp: number;
  dmg: number;
}

aoc.parse = (l: string): Input => {
  const stats = { hp: 0, dmg: 0, armor: 0 };
  l.split('\n').forEach((c) => {
    const [stat, val] = c.split(':');
    if (stat == 'Damage') stats.dmg = Number(val);
    else if (stat == 'Armor') stats.armor = Number(val);
    else if (stat == 'Hit Points') stats.hp = Number(val);
    else throw `Unknown stat: ${c}`;
  });
  return stats;
};

interface State {
  turn: number;
  playerHp: number;
  playerMana: number;
  bossHp: number;
  bossDmg: number;
  shield: number;
  recharge: number;
  posion: number;
  manaSpent: number;
  stack: string[];
  isHard: boolean;
  tracking: { bestKillMana: number };
}

export enum Spell {
  MagicMissiles = 'MagicMissiles',
  Drain = 'Drain',
  Shield = 'Shield',
  Poison = 'Poison',
  Recharge = 'Recharge',
}
const spells: Spell[] = [Spell.MagicMissiles, Spell.Drain, Spell.Shield, Spell.Poison, Spell.Recharge];

function cast(state: State, spell: Spell): State | null {
  const s = { ...state, stack: state.stack.slice() };
  if (state.isHard) s.playerHp--;

  if (s.playerHp <= 0) return null;
  let spellCost = 0;
  switch (spell) {
    case Spell.MagicMissiles:
      s.bossHp -= 4;
      spellCost = 53;
      break;
    case Spell.Drain:
      s.bossHp -= 2;
      s.playerHp += 2;
      spellCost = 73;
      break;
    case Spell.Shield:
      if (s.shield > 0) return null;
      s.shield = 6;
      spellCost = 113;
      break;
    case Spell.Poison:
      if (s.posion > 0) return null;
      s.posion = 6;
      spellCost = 173;
      break;
    case Spell.Recharge:
      if (s.recharge > 0) return null;
      s.recharge = 5;
      spellCost = 229;
      break;
    default:
      throw new Error('Unknown spell: ' + spell);
  }

  if (s.playerMana > spellCost) {
    s.manaSpent += spellCost;
    s.playerMana -= spellCost;
    s.stack.push(spell);
    return s;
  }
  return null;
}

function step(state: State): State {
  if (state.posion > 0) state.bossHp -= 3;
  if (state.recharge > 0) state.playerMana += 101;
  state.recharge--;
  state.posion--;
  state.shield--;

  state.turn++;

  return state;
}

// let mostManaSpent = 1000;
// const mostManaSpentHard = 1500;
function fight(state: State): boolean {
  if (state.manaSpent >= state.tracking.bestKillMana) return false;

  step(state);
  if (state.bossHp <= 0) {
    state.tracking.bestKillMana = Math.min(state.manaSpent, state.tracking.bestKillMana);
    return true;
  }
  // Boss Turn
  if (state.stack.length > 0) {
    state.playerHp -= state.bossDmg - (state.shield >= 0 ? 7 : 0);
    if (state.playerHp <= 0) return false;
  }

  step(state);
  if (state.bossHp <= 0) {
    state.tracking.bestKillMana = Math.min(state.manaSpent, state.tracking.bestKillMana);
    return true;
  }

  for (const sp of spells) {
    const s = cast(state, sp);
    if (s == null) continue;
    fight(s);
  }
  return true;
}

aoc.partA = (input: Input): number => {
  const state = {
    turn: 0,
    playerHp: 50,
    playerMana: 500,
    bossDmg: input.dmg,
    bossHp: input.hp,
    manaSpent: 0,
    recharge: 0,
    posion: 0,
    shield: 0,
    stack: [],
    isHard: false,
    tracking: { bestKillMana: Number.MAX_VALUE }, // 907 was too high
  };

  for (const sp of spells) {
    const s = cast(state, sp);
    if (s == null) continue;
    fight(s);
  }

  return state.tracking.bestKillMana;
};
aoc.partB = (input: Input): number => {
  const state = {
    turn: 0,
    playerHp: 50,
    playerMana: 500,
    bossDmg: input.dmg,
    bossHp: input.hp,
    manaSpent: 0,
    recharge: 0,
    posion: 0,
    shield: 0,
    stack: [],
    isHard: true,
    tracking: { bestKillMana: Number.MAX_VALUE },
  };

  for (const sp of spells) {
    const s = cast(state, sp);
    if (s == null) continue;
    fight(s);
  }

  return state.tracking.bestKillMana;
};

aoc.test();
