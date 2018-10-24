<template>
  <div class="app-container">
    <el-button @click="updateData">Bonjour</el-button>
    {{ matchs.length }} Matchs
    2017-18 : {{ m1718('MEM').length }}
  </div>
</template>

<script>
import matchsJson from '../../../static/data/nba.json'
import { matchFilterSeasonTeam } from '@/utils/filters'

export default {
  name: 'Work',

  data() {
    return {
      matchs: matchsJson,
      teamList: ['ATL', 'HOU', 'GSW', 'MEM']
    }
  },
  created() {
    this.teamList.forEach((t) => {
      console.log(t)
      console.log(matchFilterSeasonTeam(this.matchs, '2017/2018', t))
    })
  },
  methods: {
    m1718(team) {
      return matchFilterSeasonTeam(this.matchs, '2017/2018', team)
    },
    updateData() {
      const start = new Date('20/09/2017')
      const end = new Date('18/10/2017')
      this.matchs = this.matchs.map((m) => {
        const matchDate = new Date(m.date)
        console.log(matchDate)
        if (matchDate > start && matchDate < end) {
          console.log(m)
        }
      })

      // console.log(JSON.stringify(this.matchs))
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

