<template>
  <div class="app-container">
    Global : {{ globalResult }} €
    Paris : {{ nbWin }} / {{ nbParis }}
    Ratio : {{ ratioResults * 100 }} %
    <el-form ref="form" v-model="ratio" label-width="120px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="Global">
            <el-input v-model="ratio.globalRatio" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Previous">
            <el-input v-model="ratio.previousRatio" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Previous10">
            <el-input v-model="ratio.previous10Ratio" type="number"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table v-if="matchs.length < 100" :data="matchs" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Home" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.teamHome }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away" width="200">
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

    <!-- <table >
      <tr v-for="(n, k) in diff" :key="k">
        <td>{{ k }}</td>
        <td>{{ n['nb'] }}</td>
        <td>{{ n['win'] }}</td>
      </tr>
    </table> -->

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
      nbWin: 0,
      nbParis: 0,
      ratioResults: 0,
      matchs: matchsJson.slice(0, 2000),
      diff: {
        '-1': { nb: 0, win: 0 }, '-0.9': { nb: 0, win: 0 }, '-0.8': { nb: 0, win: 0 }, '-0.7': { nb: 0, win: 0 }, '-0.6': { nb: 0, win: 0 }, '-0.5': { nb: 0, win: 0 }, '-0.4': { nb: 0, win: 0 }, '-0.3': { nb: 0, win: 0 }, '-0.2': { nb: 0, win: 0 }, '-0.1': { nb: 0, win: 0 },
        '0': { nb: 0, win: 0 }, '0.1': { nb: 0, win: 0 }, '0.2': { nb: 0, win: 0 }, '0.3': { nb: 0, win: 0 }, '0.4': { nb: 0, win: 0 }, '0.5': { nb: 0, win: 0 }, '0.6': { nb: 0, win: 0 }, '0.7': { nb: 0, win: 0 }, '0.8': { nb: 0, win: 0 }, '0.9': { nb: 0, win: 0 }, '1': { nb: 0, win: 0 }
      },
      ratio: {
        globalRatio: 1,
        previousRatio: 1,
        previous10Ratio: 1
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {

    simulateBets(matchs, ratio) {
      matchs = matchs.map((m) => {
        // Home Bet
        const bet = this.betOnThisMatch(m, ratio)
        this.$set(m, 'bet', bet)

        return m
      })
      return this.getGlobalStats(matchs)
    },
    getList() {
      const res = this.simulateBets(this.matchs, {
        globalStatsHomeWin: 0.55, globalStatsAwayWin: 0.45,
        globalRatio: 1,
        previousRatio: 1,
        previous10Ratio: 1
      })

      console.log(res)
    },

    round2Decimals(number) {
      return (Math.round(number * 100) / 100)
    },
    getGlobalStats(matchs) {
      const nbParis = matchs.filter((m) => m.bet.total.bet).length

      const nbWin = matchs.filter((m) => m.bet.total.profit > 0).length

      let globalResult = 0
      matchs.forEach((m) => {
        globalResult = globalResult + m.bet.total.profit
      })
      globalResult = this.round2Decimals(globalResult)
      const ratioResults = this.round2Decimals(globalResult / nbParis)

      return {
        'nbParis': nbParis,
        'nbWin': nbWin,
        'globalResult': globalResult,
        'ratioResults': ratioResults
      }
    },
    betOnThisMatch(match, options = null) {
      const res = {
        home: { bet: false, ammount: 0, win: false, profit: 0 },
        away: { bet: false, ammount: 0, win: false, profit: 0 }
      }

      // const ammount = this.amountByBet

      res.home = this.betOnThisMatchHome(match, options)
      res.away = this.betOnThisMatchAway(match, options)

      res.total = {
        bet: res.home.bet || res.away.bet,
        ammount: res.home.ammount + res.away.ammount,
        profit: this.round2Decimals(res.home.profit + res.away.profit)
      }

      return res
    },
    betOnThisMatchHome(match, options = null) {
      let home = { bet: false, ammount: 0, win: false, profit: 0, own: 0 }

      // Home / Away
      const globalStatsHome = this.getHomeGlobalStats(match, options).home

      home.own = globalStatsHome * (options.globalRatio ? options.globalRatio : 1)
      home.own += ((match.ratio.home.previous10.ratioWin - match.ratio.away.previous10.ratioWin) / 2)
      home.own += ((match.ratio.home.previous.ratioWin - match.ratio.away.previous.ratioWin) / 2)

      // Define if bet or not
      home = this.doWeBetOnThat(match.oddHome, home.own, (match.scoreResult === 'H'))

      return home
    },
    betOnThisMatchAway(match, options = null) {
      let away = { bet: false, ammount: 0, win: false, profit: 0, own: 0 }

      // Get our Own value
      // Home / Away
      const globalStatsAway = this.getHomeGlobalStats(match, options).away

      away.own = globalStatsAway * (options.globalRatio ? options.globalRatio : 1)
      away.own += ((match.ratio.away.previous10.ratioWin - match.ratio.home.previous10.ratioWin) / 2) * (options.previous10Ratio ? options.previous10Ratio : 1)
      away.own += ((match.ratio.away.previous.ratioWin - match.ratio.home.previous.ratioWin) / 2) * (options.previousRatio ? options.previousRatio : 1)
      // Define if bet or not
      away = this.doWeBetOnThat(match.oddAway, away.own, (match.scoreResult === 'A'))
      return away
    },
    getHomeGlobalStats(match, options = null) {
      return { home: options.globalStatsHomeWin, away: options.globalStatsAwayWin }
    },
    doWeBetOnThat(odd, own, res) {
      const ammount = 1
      if ((1 / Number(odd)) < own) {
        return {
          bet: true,
          ammount: ammount,
          win: res,
          profit: res ? this.round2Decimals(ammount * odd - ammount) : this.round2Decimals(-ammount)
        }
      }
      return { bet: false, ammount: 0, win: false, profit: 0, own: 0 }
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
