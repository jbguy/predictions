<template>
  <div class="app-container">
    Team : {{ team }}
    Nb : {{ data.length }}
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="data" :row-class-name="tableRowClassName" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Date" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Home" width="100" >
        <template slot-scope="scope">
          <el-button @click.native="goToTeam(scope.row.teamHomeShort)">{{ scope.row.teamHomeShort }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Away" width="100">
        <template slot-scope="scope">
          <el-button @click.native="goToTeam(scope.row.teamAwayShort)">{{ scope.row.teamAwayShort }}</el-button>
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

    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->

  </div>
</template>

<script>

export default {
  name: 'MatchList',
  props: {
    data: { type: Array, default: () => [] },
    team: { type: String, default: '' }
  },
  created() {
  },
  methods: {
    round2Decimals(number) {
      return (Math.round(number * 100) / 100)
    },
    goToTeam(team) {
      this.$router.replace({ name: 'team_match', params: { season: '2017-2018', team: team }})
    },
    tableRowClassName({ row, rowIndex }) {
      if ((row.scoreResult === 'H' && row.teamHomeShort === this.team) || (row.scoreResult === 'A' && row.teamAwayShort === this.team)) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
