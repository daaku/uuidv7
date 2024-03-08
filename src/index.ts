const B32_CHAR = '0123456789abcdefghjkmnpqrstvwxyz'.split('')
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
 * The string is encoded using Crockford's Base32, will always be 26
 * characters in length, and is lexicographically sortable.
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

  const b1 = (ts / 2 ** 40) & 0xff
  const b2 = (ts / 2 ** 32) & 0xff
  const b3 = (ts / 2 ** 24) & 0xff
  const b4 = (ts / 2 ** 16) & 0xff
  const b5 = (ts / 2 ** 8) & 0xff
  const b6 = ts & 0xff
  const b7 = (0x70 | (randA >>> 8)) & 0xff
  const b8 = randA & 0xff
  const b9 = (0x80 | (randBHi >>> 24)) & 0xff
  const b10 = (randBHi >>> 16) & 0xff
  const b11 = (randBHi >>> 8) & 0xff
  const b12 = randBHi & 0xff
  const b13 = (randBLo >>> 24) & 0xff
  const b14 = (randBLo >>> 16) & 0xff
  const b15 = (randBLo >>> 8) & 0xff
  const b16 = randBLo & 0xff

  return (
    B32_CHAR[b1 >>> 3] +
    B32_CHAR[((b1 << 2) | (b2 >>> 6)) & 31] +
    B32_CHAR[(b2 >>> 1) & 31] +
    B32_CHAR[((b2 << 4) | (b3 >>> 4)) & 31] +
    B32_CHAR[((b3 << 1) | (b4 >>> 7)) & 31] +
    B32_CHAR[(b4 >>> 2) & 31] +
    B32_CHAR[((b4 << 3) | (b5 >>> 5)) & 31] +
    B32_CHAR[b5 & 31] +
    B32_CHAR[b6 >>> 3] +
    B32_CHAR[((b6 << 2) | (b7 >>> 6)) & 31] +
    B32_CHAR[(b7 >>> 1) & 31] +
    B32_CHAR[((b7 << 4) | (b8 >>> 4)) & 31] +
    B32_CHAR[((b8 << 1) | (b9 >>> 7)) & 31] +
    B32_CHAR[(b9 >>> 2) & 31] +
    B32_CHAR[((b9 << 3) | (b10 >>> 5)) & 31] +
    B32_CHAR[b10 & 31] +
    B32_CHAR[b11 >>> 3] +
    B32_CHAR[((b11 << 2) | (b12 >>> 6)) & 31] +
    B32_CHAR[(b12 >>> 1) & 31] +
    B32_CHAR[((b12 << 4) | (b13 >>> 4)) & 31] +
    B32_CHAR[((b13 << 1) | (b14 >>> 7)) & 31] +
    B32_CHAR[(b14 >>> 2) & 31] +
    B32_CHAR[((b14 << 3) | (b15 >>> 5)) & 31] +
    B32_CHAR[b15 & 31] +
    B32_CHAR[b16 >>> 3] +
    B32_CHAR[(b16 << 2) & 31]
  )
}
