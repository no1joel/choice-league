import { getRoundChoices } from '~/utils/getRoundChoices'

describe('getRoundChoices', () => {
  test('returns all choices when nothing has been played', () => {
    const results = [
      ['a', { losses: 0, total: 0 }],
      ['b', { losses: 0, total: 0 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a', 'b'])
  })
  test('returns all choices at same matches played', () => {
    const results = [
      ['a', { losses: 0, total: 1 }],
      ['b', { losses: 0, total: 1 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a', 'b'])
  })
  test('excludes choices below loss limit', () => {
    const results = [
      ['a', { losses: 0, total: 1 }],
      ['b', { losses: 0, total: 1 }],
      ['c', { losses: 1, total: 1 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a', 'b'])
  })
  test('returns losers round', () => {
    const results = [
      ['a', { losses: 1, total: 1 }],
      ['b', { losses: 1, total: 1 }],
      ['c', { losses: 0, total: 1 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a', 'b'])
  })
  test('returns solo loser having no loser match', () => {
    const results = [
      ['a', { losses: 1, total: 1 }],
      ['b', { losses: 0, total: 2 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a'])
  })
  test('returns solo winner having no winner match', () => {
    const results = [
      ['a', { losses: 0, total: 1 }],
      ['b', { losses: 1, total: 2 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a'])
  })
  test('returns winner vs loser for final', () => {
    const results = [
      ['a', { losses: 0, total: 2 }],
      ['b', { losses: 1, total: 2 }],
    ]
    const choices = getRoundChoices(results)

    expect(choices).toEqual(['a', 'b'])
  })
})
