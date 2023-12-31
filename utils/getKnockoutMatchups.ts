import { Choice } from './Choice'

type Result = [Choice, Choice, number]

const containsChoice = (result: Result, choice: Choice) =>
  result[0] === choice || result[1] === choice

const isMatchup = (result: Result, a: Choice, b: Choice): boolean =>
  containsChoice(result, a) && containsChoice(result, b)

export function getKnockoutMatchups(
  choices: Choice[],
  results: Result[]
): {
  matchups: [Choice, Choice][]
  choicesLeft: Choice[]
} {
  const matchups: [Choice, Choice][] = []
  const choicesLeft = [...choices]
  const allPairs: [number, Choice, Choice][] = []
  for (let i = 0; i < choicesLeft.length; i++) {
    const first = choicesLeft[i]
    for (let j = i + 1; j < choicesLeft.length; j++) {
      const second = choicesLeft[j]
      allPairs.push([
        getPreviousMatchups(results, first, second).length,
        first,
        second,
      ])
    }
  }
  allPairs.sort()

  while (allPairs.length > 0) {
    const currentMin = allPairs[0][0]
    const pairsWithLeastPrevMatches = allPairs.filter(
      ([previous]) => previous === currentMin
    )

    // are there any choices here that only appear in one pair?
    // (i suspect it could be not about _one_ pair but minimal?)
    const choices = pairsWithLeastPrevMatches.flatMap(
      ([_count, first, second]) => [first, second]
    )
    const counts = choices.reduce((acc: Map<string, number>, choice) => {
      acc.set(choice.value, (acc.get(choice.value) || 0) + 1)
      return acc
    }, new Map() as Map<string, number>)

    const mostUniqueChoiceValue = [...counts.entries()]
      .map(([value, count]) => [count, value])
      .sort()[0][1]

    const potentialPairs = pairsWithLeastPrevMatches.filter(
      ([_count, first, second]) =>
        first.value === mostUniqueChoiceValue ||
        second.value === mostUniqueChoiceValue
    )

    const pairIndex = Math.floor(Math.random() * potentialPairs.length)
    const [_count, firstChosen, secondChosen] = potentialPairs[pairIndex]
    const otherPairIndexes = allPairs
      .map(([_count, first, second], index) => [
        index,
        first === firstChosen ||
          first === secondChosen ||
          second === firstChosen ||
          second === secondChosen,
      ])
      .filter(([_index, shouldDelete]) => shouldDelete)
      .map(([index]) => index)
    otherPairIndexes.reverse().forEach((index) => allPairs.splice(index, 1))
    const choicesLeftIndexes = [
      choicesLeft.indexOf(firstChosen),
      choicesLeft.indexOf(secondChosen),
    ]
    choicesLeftIndexes
      .sort()
      .reverse()
      .forEach((index) => choicesLeft.splice(index, 1))
    matchups.push([firstChosen, secondChosen])
  }

  return { matchups, choicesLeft }
}
function getPreviousMatchups(
  results: Result[],
  first: Choice,
  other: Choice
): Result[] {
  return results.filter((result) => isMatchup(result, first, other))
}
