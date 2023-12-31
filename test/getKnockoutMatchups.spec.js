import { getKnockoutMatchups } from '~/utils/getKnockoutMatchups'

describe('getKnockoutMatchups', () => {
  it('returns the only possible matchup', () => {
    const choices = [{ value: 'A' }, { value: 'B' }]
    const results = []

    const { matchups, choicesLeft } = getKnockoutMatchups(choices, results)
    expect(matchups).toHaveLength(1)
    expect(matchups[0]).toEqual(expect.arrayContaining(choices))
    expect(choicesLeft).toEqual([])
  })
  it('returns matchups not done yet', () => {
    const choices = [
      { value: 'A' },
      { value: 'B' },
      { value: 'C' },
      { value: 'D' },
    ]
    const results = [
      [choices[0], choices[1], 1],
      [choices[0], choices[2], 1],
    ]

    const { matchups, choicesLeft } = getKnockoutMatchups(choices, results)
    expect(matchups).toHaveLength(2)
    expect(matchups).toEqual(
      expect.arrayContaining([expect.arrayContaining([choices[0], choices[3]])])
    )
    expect(matchups).toEqual(
      expect.arrayContaining([expect.arrayContaining([choices[1], choices[2]])])
    )
    expect(choicesLeft).toEqual([])
  })
  it('returns choicesLeft if no matchups', () => {
    const choices = [{ value: 'A' }]
    const results = []

    const { matchups, choicesLeft } = getKnockoutMatchups(choices, results)
    expect(matchups).toEqual([])
    expect(choicesLeft).toEqual(choices)
  })
  it('returns choicesLeft if no matchups left over', () => {
    const choices = [{ value: 'A' }, { value: 'B' }, { value: 'C' }]
    const results = [[choices[0], choices[2], 1], [(choices[1], choices[2], 1)]]

    const { matchups, choicesLeft } = getKnockoutMatchups(choices, results)
    expect(matchups).toEqual(
      expect.arrayContaining([expect.arrayContaining([choices[0], choices[1]])])
    )
    expect(choicesLeft).toEqual([choices[2]])
  })
})
