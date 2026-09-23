export const DEFAULT_TEAM_NAMES: Record<number, string> = {
  1: 'Nhóm 1',
  2: 'Nhóm 2',
  3: 'Nhóm 3',
  4: 'Nhóm 5',
  5: 'Nhóm 6',
};

export function getDefaultTeamName(teamId: number): string {
  return DEFAULT_TEAM_NAMES[teamId] ?? `Nhóm ${teamId}`;
}
