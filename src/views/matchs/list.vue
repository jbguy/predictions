<template>
  <div class="app-container">
    Global : {{ globalResult }} €
    Paris : {{ nbWin }} / {{ nbParis }}
    Ratio : {{ ratioResults * 100 }} %
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="matchs" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Home" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.teamHome }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.teamAway }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Home 10 Last" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio.home.previous10.ratioWin }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away 10 Last" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio.away.previous10.ratioWin }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="H Odd" width="100">
        <template slot-scope="scope">
          <span>{{ ( scope.row.oddHome) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="A Odd" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.oddAway }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Score" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.scoreHome }} - {{ scope.row.scoreAway }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Home bet" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.bet.home.bet }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away bet" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.bet.away.bet }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Profit home" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.bet.home.profit }} €</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Profit away" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.bet.away.profit }} €</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Odd result" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.bet.total.profit }} €</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->

  </div>
</template>

<script>
import matchsJson from '../../../static/data/nba.json'

export default {
  name: 'Matchs',

  data() {
    return {
      amountByBet: 1,
      betHome: 0.60,
      betAway: 0.40,
      globalResult: 0,
      nbWin: 0,
      nbParis: 0,
      ratioResults: 0,
      matchs: matchsJson.slice(0, 1000)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.matchs = this.matchs.map((m) => {
        this.$set(m, 'oddResult', 0)
        this.$set(m, 'homeBet', '')
        this.$set(m, 'awayBet', '')

        // Home Bet
        this.$set(m, 'bet', this.betOnThisMatch(m))

        // Away Bet
        // if ((1 / Number(m.oddAway)) > this.betAway * 1.05) {
        //   this.$set(m, 'awayBet', true)
        //   const bet = this.amountByBet * (1 / Number(m.oddAway))
        //   this.$set(m, 'oddResult', m.scoreResult === 'A' ? this.round2Decimals(bet * m.oddAway - bet) : this.round2Decimals(-bet))
        //   if (m.scoreResult === 'A') { this.nbWin++ }
        //   this.nbParis++
        // }

        return m
      })
      this.nbParis = this.matchs.filter((m) => m.bet.total.bet).length

      this.globalResult = 0
      this.matchs.forEach((m) => {
        this.globalResult = this.globalResult + m.bet.total.profit
      })
      this.globalResult = this.round2Decimals(this.globalResult)
      this.ratioResults = this.round2Decimals(this.globalResult / this.nbParis)
    },
    round2Decimals(number) {
      return (Math.round(number * 100) / 100)
    },
    betOnThisMatch(match) {
      const res = {
        home: { bet: false, ammount: 1, win: false, profit: 0 },
        away: { bet: false, ammount: 1, win: false, profit: 0 }
      }
      const ammount = this.amountByBet
      // if ((1 / Number(match.oddHome)) > this.betHome * 1.05) {
      if (match.ratio.home.previous10.ratioWin >= match.ratio.away.previous10.ratioWin) {
        res.home = {
          bet: true,
          ammount: ammount,
          win: match.scoreResult === 'H',
          profit: match.scoreResult === 'H' ? this.round2Decimals(ammount * match.oddHome - ammount) : this.round2Decimals(-ammount)
        }
      }

      // if ((1 / Number(match.oddAway)) > this.betAway * 1.05) {
      if (match.ratio.home.previous10.ratioWin < match.ratio.away.previous10.ratioWin) {
        res.away = {
          bet: true,
          ammount: ammount,
          win: match.scoreResult === 'A',
          profit: match.scoreResult === 'A' ? this.round2Decimals(ammount * match.oddAway - ammount) : this.round2Decimals(-ammount)
        }
      }

      res.total = {
        bet: res.home.bet || res.away.bet,
        ammount: res.home.ammount + res.away.ammount,
        profit: this.round2Decimals(res.home.profit + res.away.profit)
      }

      return res
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
