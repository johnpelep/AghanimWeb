import { Match } from './match';

export interface Player {
  personaName: string;
  avatar: string;
  profileUrl: string;
  dotabuffUrl: string;
  rank: Rank;
  record: Record;
  personaState: PersonaState;
  matches: Match[];
}

export interface Record {
  winCount: number;
  lossCount: number;
  streakCount: number;
  isWinStreak: boolean;
  lastMatchOn: string;
  totalGames: number;
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
