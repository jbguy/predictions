function getStatsFromMatchsBefore(matchs, team) {
  const res = {
    nbMatchsBefore: matchs.length,
    nbMatchsBeforeHome: matchs.filter((mb) => (mb.teamHomeShort === team)).length,
    nbMatchsBeforeAway: matchs.filter((mb) => (mb.teamAwayShort === team)).length,
    nbWinBeforeHome: matchs.filter((mb) => (mb.teamHomeShort === team && mb.scoreResult === 'H')).length,
    nbWinBeforeAway: matchs.filter((mb) => (mb.teamAwayShort === team && mb.scoreResult === 'A')).length
  }
  res.nbWinBefore = res.nbWinBeforeAway + res.nbWinBeforeHome
  res.ratioWin = res.nbMatchsBefore > 0 ? Math.round(res.nbWinBefore / res.nbMatchsBefore * 10000) / 10000 : 0
  res.ratioWinHome = res.nbMatchsBeforeHome > 0 ? Math.round(res.nbWinBeforeHome / res.nbMatchsBeforeHome * 10000) / 10000 : 0
  res.ratioWinAway = res.nbMatchsBeforeAway > 0 ? Math.round(res.nbWinBeforeAway / res.nbMatchsBeforeAway * 10000) / 10000 : 0
  return res
}
/**
 * Set Win Ratio depend on date
 */
export function setWinRatio(data, match, team) {
  let homeMatchs = matchFilterSeasonTeam(data, match.season, match.teamHomeShort)
  let home = {}
  if (homeMatchs !== undefined) {
    homeMatchs = sortByDate(homeMatchs)

    const matchsBefore = homeMatchs.filter((mb) => (new Date(mb.date) < new Date(match.date)))

    home = {
      previous: getStatsFromMatchsBefore(matchsBefore, match.teamHomeShort),
      previous5: getStatsFromMatchsBefore(matchsBefore.slice(-5), match.teamHomeShort),
      previous10: getStatsFromMatchsBefore(matchsBefore.slice(-10), match.teamHomeShort),
      previous20: getStatsFromMatchsBefore(matchsBefore.slice(-20), match.teamHomeShort)
    }
  }

  let awayMatchs = matchFilterSeasonTeam(data, match.season, match.teamAwayShort)
  let away = {}
  if (awayMatchs !== undefined) {
    awayMatchs = sortByDate(awayMatchs)

    const matchsBeforeAway = awayMatchs.filter((mb) => (new Date(mb.date) < new Date(match.date)))

    away = {
      previous: getStatsFromMatchsBefore(matchsBeforeAway, match.teamAwayShort),
      previous5: getStatsFromMatchsBefore(matchsBeforeAway.slice(-5), match.teamAwayShort),
      previous10: getStatsFromMatchsBefore(matchsBeforeAway.slice(-10), match.teamAwayShort),
      previous20: getStatsFromMatchsBefore(matchsBeforeAway.slice(-20), match.teamAwayShort)
    }
  }

  match.ratio = {
    home: home,
    away: away
  }

  return match
}

export function sortByDate(data) {
  return data.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date)
  })
}

export function matchFilterSeason(data, season) {
  return data.filter((m) => (m.season === season))
}

export function matchFilterSeasonTeam(data, season, team) {
  return data.filter((m) => ((m.season === season && m.teamHomeShort === team) || (m.season === season && m.teamAwayShort === team)))
}

