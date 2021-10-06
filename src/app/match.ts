import { Hero } from './hero';

export interface Match {
  matchId: number;
  isWin: boolean;
  heroId: number;
  dotabuffUrl: string;
  startTime: string;
  playerId: number;
  duration: number;
  kills: number;
  deaths: number;
  assists: number;

  // custom fields
  time: string;
  hero: Hero;
  personaName: string;
  durationInTime: string;
  kda: string;
}

export interface SortedMatch {
  date: string;
  matches: Match[];
}
