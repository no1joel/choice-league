<template>
  <div>
    <h1 class="text-xl font-thin italic">And the winner is...</h1>
    <span class="text-9xl font-bold">{{ winner }}</span>

    <h2 class="mt-16 text-lg font-bold">Rankings</h2>
    <ul>
      <li v-for="[rank, choice] in rankings" :key="choice">
        <span class="font-serif">#{{ rank }}</span>
        <span>{{ choice }}</span>
        <span class="font-thin font-mono text-xs"
          >({{ wins[choice] || 0 }})</span
        >
      </li>
    </ul>
    <h2 class="mt-16 text-lg font-bold">Replay</h2>
    <ul>
      <li
        v-for="([first, second, winIndex], index) in reverseResults"
        :key="index"
      >
        <span>{{ index + 1 }}.</span>
        <span
          :class="{ 'font-bold': winIndex === 0, 'font-thin': winIndex === 1 }"
          >{{ first }}
        </span>
        <span class="text-sm italic">vs</span>
        <span
          :class="{ 'font-bold': winIndex === 1, 'font-thin': winIndex === 0 }"
          >{{ second || 'No contest!' }}</span
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    results: {
      type: Array,
      required: true,
    },
    wins: {
      type: Object,
      required: true,
    },
    winner: {
      type: String,
      required: true,
    },
  },
  computed: {
    winCountsRanked() {
      return [...new Set(Object.values(this.wins))].sort().reverse()
    },
    reverseResults() {
      return this.results.slice().reverse()
    },
    rankings() {
      const choices = new Set(
        this.results
          .flatMap(([first, second]) => [first, second])
          .filter((choice) => choice !== null)
      )
      return [...choices]
        .map((choice) => [this.getRanking(choice), choice])
        .map(([ranking, choice]) => [
          ranking === 0 ? this.winCountsRanked.length + 1 : ranking,
          choice,
        ])
        .sort(([firstRank], [secondRank]) => secondRank - firstRank)
        .reverse()
    },
  },
  methods: {
    getRanking(choice: string): number {
      const winCount = this.wins[choice]
      if (winCount === -1) {
        return Object.entries(this.wins).length
      }
      return this.winCountsRanked.indexOf(winCount) + 1
    },
  },
}
</script>
