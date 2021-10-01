import { Hero } from './hero';

export interface Player {
  personaName: string;
  avatar: string;
  profileUrl: string;
  dotabuffUrl: string;
  rank: Rank;
  records: Record[];
  personaState: PersonaState;
  matches: Match[];
}

export interface Match {
  matchId: number;
  isWin: boolean;
  heroId: number;
  dotabuffUrl: string;
  year: number;
  month: number;
  startTime: string;
  time: string;
  hero: Hero;
}

export interface Record {
  month: number;
  year: number;
  winCount: number;
  lossCount: number;
  streakCount: number;
  isWinStreak: boolean;
  lastMatchOn: string;
  winRate: number;
}

interface PersonaState {
  id: number;
  name: string;
  game: string;
  lastLogOff: string;
}

interface Rank {
  tier: number;
  medalName: string;
  medalUrl: string;
}
