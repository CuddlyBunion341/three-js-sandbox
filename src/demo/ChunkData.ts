import { Chunk } from "./Chunk"

export class ChunkData {
  public static readonly WIDTH = 32
  public static readonly HEIGHT = 128
  public static readonly DEPTH = 32

  public blocks: Uint8Array
  public neighbors!: Chunk[] // -x, x, -z, z

  public static get chunkSize() {
    return ChunkData.WIDTH * ChunkData.HEIGHT * ChunkData.DEPTH
  }

  constructor() {
    this.blocks = new Uint8Array(ChunkData.chunkSize)

    for (let i = 0; i < ChunkData.chunkSize; i++) {
      this.blocks[i] = 0
    }
  }

  public getBlockIndex(x: number, y: number, z: number) {
    if (x < 0 || x >= ChunkData.WIDTH || y < 0 || y >= ChunkData.HEIGHT || z < 0 || z >= ChunkData.DEPTH) return -1
    return this.getUnsafeBlockIndex(x, y, z)
  }

  public getUnsafeBlockIndex(x: number, y: number, z: number) {
    return x + ChunkData.WIDTH * (y + ChunkData.HEIGHT * z)
  }

  public getNeighborBlock(x: number, y: number, z: number) {
    if (!this.neighbors) throw new Error('cannot use neightbor block without neighbors!')

    if (x < 0) return this.neighbors[0].getUnsafeBlock(ChunkData.WIDTH + x, y, z)
    if (x >= ChunkData.WIDTH) return this.neighbors[1].getUnsafeBlock(x - ChunkData.WIDTH, y, z)
    if (z < 0) return this.neighbors[2].getUnsafeBlock(x, y, ChunkData.DEPTH + z)
    if (z >= ChunkData.DEPTH) return this.neighbors[3].getUnsafeBlock(x, y, z - ChunkData.DEPTH)

    return this.getBlock(x, y, z)
  }

  public getBlock(x: number, y: number, z: number) {
    const index = this.getBlockIndex(x, y, z)
    return this.blocks[index]
  }

  public getUnsafeBlock(x: number, y: number, z: number) {
    const index = this.getUnsafeBlockIndex(x, y, z)
    return this.blocks[index]
  }

  public setBlock(x: number, y: number, z: number, block: number) {
    ChunkData.DEPTH

    const index = this.getBlockIndex(x, y, z)
    if (index === -1) throw new Error(`Couldn't set block @[${x},${y},${z}] because position is outside of chunk`)
    this.blocks[index] = block
  }

  public setUnsafeBlock(x: number, y: number, z: number, block: number) {
    const index = this.getUnsafeBlockIndex(x, y, z)
    this.blocks[index] = block
  }
}
