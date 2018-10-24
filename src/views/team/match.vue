<template>
  <div class="app-container">
    <match-list :data="data" :team="$route.params.team"/>
  </div>
</template>

<script>
import matchsJson from '../../../static/data/nba.json'
import { matchFilterSeasonTeam } from '@/utils/filters'
import MatchList from '@/components/Matchs/MatchList'

export default {
  name: 'TeamMatch',
  components: { MatchList },
  data() {
    return {
      matchs: matchsJson,
      data: []
    }
  },
  created() {
    this.data = matchFilterSeasonTeam(this.matchs, this.$route.params.season, this.$route.params.team)
  },
  methods: {
  }
}
</script>

