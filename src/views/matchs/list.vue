<template>
  <div class="app-container">
    Global : {{ globalResult }} €
    Paris : {{ nbParis }}
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

      <el-table-column align="center" label="Date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.Date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="H Odd" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.oddHome }}</span>
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

      <el-table-column align="center" label="Home bet" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.homeBet }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away bet" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.awayBet }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Odd result" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.oddResult }} €</span>
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
      betHome: 0.55,
      betAway: 0.45,
      globalResult: 0,
      nbParis: 0,
      ratioResults: 0,
      matchs: matchsJson.slice(0, 5000)
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
