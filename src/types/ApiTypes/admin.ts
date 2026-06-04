export interface ContentAdmin {
  id: number;
  nom: string;
  type: string;
}

export interface AdminStats {
  users: number;
  favorites: number;
  concepts: number;
  categories: number;
  mathematicien: number;
  users_growth: number;
  concepts_growth: number;
}

export interface ApiRouteMetric {
  method: string;
  endpoint: string;
  total_hits: number;
  avg_duration: number;
}

export interface DailyHit {
  date: string;
  hits: number;
}

export interface ApiAnalytics {
  daily_hits: number;
  top_routes: ApiRouteMetric[];
  weekly_hits: DailyHit[];
}

export interface RecentActivityItem {
  id: number;
  nom: string;
  type: string;
  action: string;
  date: string;
}
