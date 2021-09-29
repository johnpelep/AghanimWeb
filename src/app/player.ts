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

interface PersonaState {
  id: number;
  name: string;
  game: string;
  lastLogOff: string;
}

interface Match {
  id: number;
  isWin: boolean;
  heroId: number;
  dotabuffUrl: string;
  year: number;
  month: number;
  day: number;
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
