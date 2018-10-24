
export function matchFilterSeason(data, season) {
  return data.filter((m) => (m.season === season))
}

export function matchFilterSeasonTeam(data, season, team) {
  return data.filter((m) => ((m.season === season && m.teamHomeShort === team) || (m.season === season && m.teamAwayShort === team)))
}

