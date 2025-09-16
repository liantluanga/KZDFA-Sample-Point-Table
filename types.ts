export interface Team {
  id: number;
  logo: string | null;
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  f: number;
  a: number;
}

export interface Group {
  id: number;
  name: string;
  teams: Team[];
}

export interface LeagueData {
  title: string;
  subTitle: string;
  matchDay: number;
  date: string;
  groups: Group[];
  footerText: string;
  footerLogo: string | null;
}
