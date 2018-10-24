<template>
  <div class="app-container">
    <ul>
      <li v-for="t in teamList" :key="t" @click="goToTeam(t)">{{ t }}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'TeamList',
  data() {
    return {
      teamList: ['DET', 'CHI', 'IND', 'CHA', 'ATL', 'HOU', 'GSW', 'MEM', 'LAC', 'LAL', 'UTA', 'POR',
        'SAC', 'MIA', 'NYK', 'CLE', 'SAS', 'DAL', 'MIN', 'TOR', 'DEN', 'NOP', 'BOS', 'BKN', 'ORL', 'WAS', 'MIL', 'OKC', 'PHI', 'PHX']
    }
  },
  created() {
  },
  methods: {
    goToTeam(team) {
      this.$router.push({ name: 'team_match', params: { season: '2017-2018', team: team }})
    }
  }
}
</script>

