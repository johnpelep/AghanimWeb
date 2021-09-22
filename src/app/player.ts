export interface Player {
  id: number;
  personaName: string;
  avatar: string;
  rankTier: number;
  rank: Rank;
}

interface Rank {
  tier: number;
  medalName: string;
  medalUrl: string;
}
