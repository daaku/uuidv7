const MAX_COUNTER = 2 ** 42 - 1
const BUFFER_LENGTH = 1024
const buffer = new Uint32Array(BUFFER_LENGTH)
let cursor = BUFFER_LENGTH
let counter = 0
let lastTS = 0

const randUint32 = () => {
  if (cursor === BUFFER_LENGTH) {
    crypto.getRandomValues(buffer)
    cursor = 0
  }
  return buffer[cursor++]
}

const resetCounter = () => {
  counter = randUint32() * 0x400 + (randUint32() & 0x3ff)
}

/**
 * Generate a UUIDv7 string.
 *
 * Optionally specify the timestamp. Defaults to now.
 *
 * System time changes may break the monotonicity gurantee (they will still be
 * unique, just not incrementing).
 */
export const uuidv7 = (ts?: number): string => {
  ts = ts ?? Date.now()

  // either to counter goes up, or gets reset
  if (counter !== 0 && ts === lastTS) {
    counter++
  } else {
    resetCounter()
  }

  // if counter is maxed out, increment ts by 1
  if (counter > MAX_COUNTER) {
    ts++
    resetCounter()
  }

  lastTS = ts

  const randA = Math.trunc(counter / 2 ** 30)
  const randBHi = counter & (2 ** 30 - 1)
  const randBLo = randUint32()
  return [
    ts.toString(16).padStart(12, '0'),
    ((0x70 | (randA >>> 8)) & 0xff).toString(16).padStart(2, '0'),
    (randA & 0xff).toString(16).padStart(2, '0'),
    ((0x80 | (randBHi >>> 24)) & 0xff).toString(16).padStart(2, '0'),
    ((randBHi >>> 16) & 0xff).toString(16).padStart(2, '0'),
    ((randBHi >>> 8) & 0xff).toString(16).padStart(2, '0'),
    (randBHi & 0xff).toString(16).padStart(2, '0'),
    ((randBLo >>> 24) & 0xff).toString(16).padStart(2, '0'),
    ((randBLo >>> 16) & 0xff).toString(16).padStart(2, '0'),
    ((randBLo >>> 8) & 0xff).toString(16).padStart(2, '0'),
    (randBLo & 0xff).toString(16).padStart(2, '0'),
  ].join('')
}
