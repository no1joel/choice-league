<template>
  <div class="h-full w-full">
    <h1 class="text-xl font-thin italic">And the winner is...</h1>
    <span class="text-9xl font-bold">{{ winner.value }}</span>

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
          >{{ first.value }}
        </span>
        <span class="text-sm italic">vs</span>
        <span
          :class="{ 'font-bold': winIndex === 1, 'font-thin': winIndex === 0 }"
          >{{ (second !== null && second.value) || 'No contest!' }}</span
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Choice } from '~/utils/Choice'

export default Vue.extend({
  props: {
    results: {
      type: Array as PropType<[Choice, Choice | null, number][]>,
      required: true,
    },
    wins: {
      type: Object as PropType<Record<string, number>>,
      required: true,
    },
    winner: {
      type: Object as PropType<Choice>,
      required: true,
    },
  },
  computed: {
    winCountsRanked(): number[] {
      return [...new Set(Object.values(this.wins) as number[])].sort().reverse()
    },
    reverseResults() {
      return this.results.slice().reverse()
    },
    rankings(): [number, Choice][] {
      const choices = new Set(
        this.results
          .flatMap(([first, second]) => [first, second])
          .filter((choice) => choice !== null)
      ) as Set<Choice>
      return [...choices]
        .map((choice) => [this.getRanking(choice), choice] as [number, Choice])
        .map(
          ([ranking, choice]) =>
            [
              ranking === 0 ? this.winCountsRanked.length + 1 : ranking,
              choice,
            ] as [number, Choice]
        )
        .sort(([firstRank], [secondRank]) => secondRank - firstRank)
        .reverse()
    },
  },
  methods: {
    getRanking(choice: Choice): number {
      const winCount = this.wins[choice.value]
      if (winCount === -1) {
        return Object.entries(this.wins).length
      }
      return this.winCountsRanked.indexOf(winCount) + 1
    },
  },
})
</script>
