import { ChunkData } from "../src/demo/ChunkData"

describe("ChunkData", () => {
  test("accessors working properly", () => {
    const chunkData = new ChunkData()
    chunkData.setBlock(1, 1, 1, 1)
    chunkData.setBlock(0, 1, 1, 0)

    expect(chunkData.getBlock(1, 1, 1)).toBe(1)
    expect(chunkData.getBlock(0, 1, 1)).toBe(0)

    expect(chunkData.blocks.filter((v => v === 1)).length).toBe(1)

    chunkData.setBlock(2, 0, 1, 1)
    expect(chunkData.blocks.filter((v => v === 1)).length).toBe(2)
  })
})
