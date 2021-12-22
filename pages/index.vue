<template>
  <main>
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

enum STATE {
  MODE_SELECT,
  ENTERING_CHOICES,
  BATTLE,
  RESULTS,
}

enum MODE {
  ROUND_ROBIN = 'Round Robin',
  KNOCKOUT = 'Knockout',
}

export default Vue.extend({
  name: 'IndexPage',
  data(): {
    state: STATE
    choices: string[]
    matchups: [string, string][]
    currentMatchupIndex: number
    results: [string, string | null, number][]
    winner: string
    modes: MODE[]
    mode: MODE
  } {
    return {
      state: STATE.MODE_SELECT,
      choices: [],
      matchups: [],
      currentMatchupIndex: 0,
      results: [],
      winner: '',
      mode: MODE.ROUND_ROBIN,
      modes: Object.values(MODE),
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
    currentMatchup(): [string, string] | undefined {
      return this.matchups[this.currentMatchupIndex]
    },
    wins(): Record<string, number> {
      return this.results
        .map(([first, second, winIndex]) => [first, second][winIndex])
        .reduce((acc, choice) => {
          if (choice === null) {
            return acc
          }
          const winCount = acc[choice] === undefined ? 0 : acc[choice]
          acc[choice] = winCount + 1
          return acc
        }, {} as Record<string, number>)
    },
  },
  methods: {
    onModeSelected(mode: MODE) {
      this.state = STATE.ENTERING_CHOICES
      this.mode = mode
    },
    onChoicesEntered(choices: string[]) {
      this.state = STATE.BATTLE
      this.choices = choices
      this.results = []
      this.winner = ''

      if (this.mode === MODE.KNOCKOUT) {
        const {
          matchups,
          choicesLeft,
        }: { matchups: [string, string][]; choicesLeft: string[] } =
          getKnockoutMatchups(choices)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.results.push([remainder, null, 0])
        }
      } else {
        const {
          matchups,
          choicesLeft,
        }: { matchups: [string, string][]; choicesLeft: string[] } =
          getRoundRobinMatchups(choices)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.results.push([remainder, null, 0])
        }
      }
    },
    onDecisionMade(choice: string): void {
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

      const maxWins = Object.values(this.wins).sort().reverse()[0]
      const winners = Object.entries(this.wins)
        .filter(([, winCount]) => winCount === maxWins)
        .map(([choice]) => choice)
      if (winners.length === 1) {
        const [winner] = winners
        this.winner = winner
        this.state = STATE.RESULTS
        return
      }

      if (this.mode === MODE.KNOCKOUT) {
        const {
          matchups,
          choicesLeft,
        }: { matchups: [string, string][]; choicesLeft: string[] } =
          getKnockoutMatchups(winners)
        this.matchups = matchups
        if (choicesLeft.length > 0) {
          const [remainder] = choicesLeft
          this.results.push([remainder, null, 0])
        }
      }
    },
  },
})

function getKnockoutMatchups(choices: string[]): {
  matchups: [string, string][]
  choicesLeft: string[]
} {
  const matchups: [string, string][] = []
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

function getRoundRobinMatchups(choices: string[]): {
  matchups: [string, string][]
  choicesLeft: string[]
} {
  const matchups: [string, string][] = []

  let copy = choices.slice()
  while (copy.length > 1) {
    const [first, ...rest] = copy
    copy = rest
    rest
      .map((other) => [first, other])
      .map(
        (pair) =>
          (Math.random() > 0.5 ? pair.reverse() : pair) as [string, string]
      )
      .forEach((pair) => matchups.push(pair))
  }

  matchups.sort(() => Math.random() - 0.5)

  return { matchups, choicesLeft: [] }
}
</script>
