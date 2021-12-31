export function getRoundChoices(
  potential: [string, { losses: number; total: number }][]
): string[] {
  const lossTotals = potential
    .map(([, { losses, total }]) => [total, losses])
    .sort(([firstTotal, firstLosses], [secondTotal, secondLosses]) => {
      const lossDiff = firstLosses - secondLosses
      if (lossDiff !== 0) {
        return lossDiff
      }

      const totalDiff = firstTotal - secondTotal
      return totalDiff
    })
  const totals = new Set(lossTotals.map(([total]) => total))
  let roundChoices: string[] = []
  while (roundChoices.length < 2 && lossTotals.length > 0) {
    const [lossTotalSelector] = lossTotals.splice(0, 1)
    const [totalSelector, lossSelector] = lossTotalSelector
    roundChoices = potential
      .filter(
        ([, { losses, total }]) =>
          losses === lossSelector && total === totalSelector
      )
      .map(([choice]) => choice)
  }
  if (roundChoices.length < 2 && totals.size === 1) {
    return potential.map(([choice]) => choice)
  }
  if (roundChoices.length < 2) {
    const lowestTotal = Math.min(...totals)
    return potential
      .filter(([, { total }]) => total === lowestTotal)
      .map(([choice]) => choice)
  }
  return roundChoices
}
