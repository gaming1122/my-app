
export type UserRole = 'ADMIN' | 'USER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  points: number;
  bottles: number;
  joinedAt: string;
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  LEADERBOARD = 'LEADERBOARD',
  IOT_FIRMWARE = 'IOT_FIRMWARE',
  BACKEND_SPECS = 'BACKEND_SPECS',
  AI_INSIGHTS = 'AI_INSIGHTS',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  SYSTEM_LOGS = 'SYSTEM_LOGS',
  MY_PROFILE = 'MY_PROFILE',
  SETTINGS = 'SETTINGS'
}
