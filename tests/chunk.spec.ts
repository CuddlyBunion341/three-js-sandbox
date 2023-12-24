import { Chunk } from '../src/demo/chunk'

describe("Chunk", () => {
  it("implements #getBlock() correctly", () => {
    const chunk = new Chunk(0, 0)
    expect(chunk.getBlockIndex(0, 0, 0)).toBe(0)
    expect(chunk.getBlockIndex(15, 0, 0)).toBe(15)
    expect(chunk.getBlockIndex(0, 0, 1)).toBe(16)
  })
})
