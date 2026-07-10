import { deepEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { uuidv7 } from '../src/index.ts'

test('generate some ids', () => {
  const ids = []
  for (let i = 0; i < 10000; i++) {
    ids.push(uuidv7())
  }

  ids.map(id => deepEqual(id.length, 26))
  deepEqual((new Set(ids)).size, ids.length)
  deepEqual(ids.toSorted(), ids)
})
