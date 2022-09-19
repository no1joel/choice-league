<template>
  <main class="p-10 h-screen w-screen">
    <ModeSelection
      v-if="showModeSelection"
      :modes="modes"
      @selected="onModeSelected"
    />
    <ChoicesInput v-else-if="showInput" @choices-entered="onChoicesEntered" />
    <ChoiceDecision
      v-else-if="showBattle && currentMatchup"
      :first-choice="currentMatchup[0]"
      :second-choice="currentMatchup[1]"
      :round-count="roundCount"
      :round-index="round"
      :matchup-count="matchups.length"
      :matchup-index="currentMatchupIndex"
      @decision-made="onDecisionMade"
    />
    <ChoiceResults
      v-if="showResults"
      :results="results"
      :winner="winner"
      :wins="wins"
    />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Choice } from '../utils/Choice'
import { getRoundChoices } from '../utils/getRoundChoices'

enum STATE {
  MODE_SELECT,
  ENTERING_CHOICES,
  BATTLE,
  RESULTS,
}

enum MODE {
  KNOCKOUT = 'Knockout',
  DOUBLE_ELIMINATION = 'Double Elimination',
  ROUND_ROBIN = 'Round Robin',
}

interface ResultCounts {
  wins: number
  losses: number
  total: number
}
type ChoiceResults = [Choice, ResultCounts][]

export default Vue.extend({
  name: 'IndexPage',
  data(): {
    state: STATE
    choices: Choice[]
    matchups: [Choice, Choice | null][]
    currentMatchupIndex: number
    results: [Choice, Choice | null, number][]
    winner: Choice | null
    modes: MODE[]
    mode: MODE
    round: number
    roundCount: number
  } {
    return {
      state: STATE.MODE_SELECT,
      choices: [],
      matchups: [],
      currentMatchupIndex: 0,
      results: [],
      winner: null,
      mode: MODE.ROUND_ROBIN,
      modes: Object.values(MODE),
      round: 0,
      roundCount: 0,
    }
  },
  computed: {
    showModeSelection(): boolean {
      return this.state === STATE.MODE_SELECT
    },
    showInput(): boolean {
      return this.state === STATE.ENTERING_CHOICES
    },
    showBattle(): boolean {
      return this.state === STATE.BATTLE
    },
    showResults(): boolean {
      return this.state === STATE.RESULTS
    },
    currentMatchup(): [Choice, Choice | null] | undefined {
      return this.matchups[this.currentMatchupIndex]
    },
    choiceResults(): ChoiceResults {
      return this.results.reduce(
        (acc: ChoiceResults, [first, second, winIndex]) => {
          const choices = [first, second]
          const [winner] = choices.splice(winIndex, 1)
          const [loser] = choices
          const getChoiceIndex = (choice: Choice) =>
            acc.findIndex(([c]) => c === choice)
          const getChoiceDefaults = (): ResultCounts => ({
            wins: 0,
            losses: 0,
            total: 0,
          })
          const getChoiceValues = (choice: Choice) => {
            const index = getChoiceIndex(choice)
            if (index > -1) {
              return { ...acc[index][1] }
            }
            return getChoiceDefaults()
          }
          const setChoiceValues = (choice: Choice, values: ResultCounts) => {
            const index = getChoiceIndex(choice)
            if (index > -1) {
              acc[index][1] = values
            } else {
              acc.push([choice, values])
            }
          }
          if (winner !== null) {
            const counts = getChoiceValues(winner)
            counts.wins += 1
            counts.total += 1
            setChoiceValues(winner, counts)
          }
          if (loser !== null) {
            const counts = getChoiceValues(loser)
            counts.losses += 1
            counts.total += 1
            setChoiceValues(loser, counts)
          }
          return acc
        },
        []
      )
    },
    wins(): [Choice, number][] {
      return this.choiceResults.map(([choice, { wins }]) => [choice, wins])
    },
    losses(): [Choice, number][] {
      return this.choiceResults.map(([choice, { losses }]) => [choice, losses])
    },
    winners(): Choice[] {
      const maxWins = this.choiceResults
        .map(([, { wins }]) => wins)
        .sort()
        .reverse()[0]
      return this.choiceResults
        .filter(([, { wins }]) => wins === maxWins)
        .map(([choice]) => choice)
    },
    singleLosers(): Choice[] {
      return this.choiceResults
        .filter(([, { losses }]) => losses === 1)
        .map(([choice]) => choice)
    },
    lossLimit(): number {
      let lossLimit: number
      switch (this.mode) {
        case MODE.KNOCKOUT:
          lossLimit = 1
          break
        case MODE.DOUBLE_ELIMINATION:
          lossLimit = 2
          break
        case MODE.ROUND_ROBIN:
          lossLimit = this.choices.length - 1
      }
      return lossLimit
    },
    activeChoices(): [
      Choice,
      { wins: number; losses: number; total: number }
    ][] {
      return this.choiceResults.filter(
        ([, { losses }]) => losses < this.lossLimit
      )
    },
  },
  methods: {
    onModeSelected(mode: MODE) {
      this.state = STATE.ENTERING_CHOICES
      this.mode = mode
    },
    onChoicesEntered(choices: Choice[]) {
      this.state = STATE.BATTLE
      this.choices = choices
      this.results = []
      this.winner = null
      this.round = 0

      if (this.mode === MODE.ROUND_ROBIN) {
        this.roundCount = 0
        const {
          matchups,
          choicesLeft,
        }: { matchups: [Choice, Choice][]; choicesLeft: Choice[] } =
          getRoundRobinMatchups(choices)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.results.push([remainder, null, 0])
        }
      } else {
        this.roundCount = Math.ceil(Math.log2(choices.length))
        const {
          matchups,
          choicesLeft,
        }: { matchups: [Choice, Choice][]; choicesLeft: Choice[] } =
          getKnockoutMatchups(choices)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.results.push([remainder, null, 0])
        }
      }
    },
    onDecisionMade(choice: Choice): void {
      if (this.currentMatchup === undefined) {
        return
      }
      const index = this.currentMatchup.indexOf(choice)
      this.results.push([...this.currentMatchup, index])
      if (this.currentMatchupIndex < this.matchups.length - 1) {
        this.currentMatchupIndex++
        return
      }

      this.currentMatchupIndex = 0
      this.round += 1

      if (this.mode === MODE.ROUND_ROBIN) {
        const winner = this.winners[0]
        this.winner = winner
        this.state = STATE.RESULTS
        return
      }

      if (this.activeChoices.length === 1) {
        const [winner] = this.activeChoices[0]
        this.winner = winner
        this.state = STATE.RESULTS
        return
      }

      if (
        this.mode === MODE.KNOCKOUT ||
        this.mode === MODE.DOUBLE_ELIMINATION
      ) {
        const roundChoices: Choice[] = getRoundChoices(this.activeChoices)

        const {
          matchups,
          choicesLeft,
        }: { matchups: [Choice, Choice][]; choicesLeft: Choice[] } =
          getKnockoutMatchups(roundChoices)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.matchups.unshift([remainder, null])
          this.onDecisionMade(remainder)
        }
      }
    },
  },
})

function getKnockoutMatchups(choices: Choice[]): {
  matchups: [Choice, Choice][]
  choicesLeft: Choice[]
} {
  const matchups: [Choice, Choice][] = []
  const choicesLeft = [...choices]

  while (choicesLeft.length > 1) {
    const firstIndex = Math.floor(choicesLeft.length * Math.random())
    const [first] = choicesLeft.splice(firstIndex, 1)
    const secondIndex = Math.floor(choicesLeft.length * Math.random())
    const [second] = choicesLeft.splice(secondIndex, 1)
    matchups.push([first, second])
  }

  return { matchups, choicesLeft }
}

function getRoundRobinMatchups(choices: Choice[]): {
  matchups: [Choice, Choice][]
  choicesLeft: Choice[]
} {
  const matchups: [Choice, Choice][] = []

  let copy = choices.slice()
  while (copy.length > 1) {
    const [first, ...rest] = copy
    copy = rest
    rest
      .map((other) => [first, other])
      .map(
        (pair) =>
          (Math.random() > 0.5 ? pair.reverse() : pair) as [Choice, Choice]
      )
      .forEach((pair) => matchups.push(pair))
  }

  matchups.sort(() => Math.random() - 0.5)

  return { matchups, choicesLeft: [] }
}
</script>
