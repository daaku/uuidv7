import { expect, test } from 'bun:test'
import { uuidv7 } from '../src/index.js'

test('generate some ids', () => {
  const ids = []
  for (let i = 0; i < 10000; i++) {
    ids.push(uuidv7())
  }

  ids.map(id => expect(id).toHaveLength(32))
  expect(new Set(ids)).toHaveLength(ids.length)
  expect(ids.toSorted()).toEqual(ids)
})
