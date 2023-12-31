import { Choice } from './Choice'

export function getRoundRobinMatchups(choices: Choice[]): {
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
