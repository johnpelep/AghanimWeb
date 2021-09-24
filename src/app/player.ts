export interface Player {
  personaName: string;
  avatar: string;
  profileUrl: string;
  dotabuffUrl: string;
  rank: Rank;
  records: Record[];
  personaState: PersonaState;
}

interface Rank {
  tier: number;
  medalName: string;
  medalUrl: string;
}

interface Record {
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
  name: string;
  game: string;
  lastLogOff: string;
}
