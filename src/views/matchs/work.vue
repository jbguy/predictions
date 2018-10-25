<template>
  <div class="app-container">
    <el-button @click="updateData">Bonjour</el-button>
    {{ matchs.length }} Matchs
    2017-18 : {{ m1718('MEM').length }}
  </div>
</template>

<script>
import matchsJson from '../../../static/data/nba.json'
import { matchFilterSeasonTeam, matchFilterSeason } from '@/utils/filters'
import { setWinRatio } from '@/utils/sport'

export default {
  name: 'Work',

  data() {
    return {
      matchs: matchsJson,
      seasonList: ['2009-2010', '2010-2011', '2011-2012', '2012-2013', '2013-2014', '2014-2015', '2015-2016', '2016-2017', '2017-2018'],
      teamList: ['DET', 'CHI', 'IND', 'CHA', 'ATL', 'HOU', 'GSW', 'MEM', 'LAC', 'LAL', 'UTA', 'POR', 'SAC', 'MIA', 'NYK', 'CLE', 'SAS', 'DAL', 'MIN', 'TOR', 'DEN', 'NOP', 'BOS', 'BKN', 'ORL', 'WAS', 'MIL', 'OKC', 'PHI', 'PHX']
    }
  },
  created() {
    console.log(this.teamList.length)
    this.teamList.forEach((t) => {
      console.log(t + ' => ' + matchFilterSeasonTeam(this.matchs, '2017-2018', t).length)
      console.log()
    })
  },
  methods: {
    m1718() {
      return matchFilterSeason(this.matchs, '2017-2018')
    },
    updateData() {
      console.log(this.matchs.splice(10))
      // this.matchs = this.matchs.map((m) => {
      //   console.log()
      //   console.log(m.date.substring(3, 5))
      //   console.log(m.date.substring(6, 10))

      //   this.$set(m, 'date', m.date.substring(3, 5) + '/' + m.date.substring(0, 2) + '/' + m.date.substring(6, 10))
      //   return m
      // })
      this.matchs = this.matchs.map((m) => {
        return setWinRatio(this.matchs, m)
      })

      console.log(JSON.stringify(this.matchs))
    },
    getList() {
      this.matchs = this.matchs.map((m) => {
        m.oddHome = m.oddHome.toString().replace(',', '.')
        m.oddAway = m.oddAway.toString().replace(',', '.')

        this.$set(m, 'oddResult', 0)

        // Home Bet
        if ((1 / Number(m.oddHome)) < this.betHome) {
          this.$set(m, 'homeBet', true)
          this.$set(m, 'oddResult', m.scoreResult === 'H' ? this.round2Decimals(this.amountByBet * m.oddHome - this.amountByBet) : this.round2Decimals(-this.amountByBet))
          this.nbParis++
        }

        // Away Bet
        if ((1 / Number(m.oddAway)) < this.betAway) {
          this.$set(m, 'awayBet', true)
          this.$set(m, 'oddResult', m.scoreResult === 'A' ? this.round2Decimals(this.amountByBet * m.oddAway - this.amountByBet) : this.round2Decimals(-this.amountByBet))
          this.nbParis++
        }

        return m
      })

      this.globalResult = 0
      this.matchs.forEach((m) => {
        this.globalResult = this.globalResult + m.oddResult
      })
      this.globalResult = this.round2Decimals(this.globalResult)
      this.ratioResults = this.round2Decimals(this.globalResult / this.nbParis)
    },
    round2Decimals(number) {
      return (Math.round(number * 100) / 100)
    }

  }
}
</script>

  <style>
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  </style>

  <style scoped>
  .icon-star{
    margin-right:2px;
  }
  .drag-handler{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d{
    margin-top: 15px;
  }
  </style>

