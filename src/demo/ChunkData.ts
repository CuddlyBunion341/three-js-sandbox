export class ChunkData {
  public static readonly WIDTH = 16
  public static readonly HEIGHT = 128
  public static readonly DEPTH = 16

  public blocks: Uint8Array

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

  public getBlock(x: number, y: number, z: number) {
    const index = this.getBlockIndex(x, y, z)
    return this.blocks[index]
  }

  public getUnsafeBlock(x: number, y: number, z: number) {
    const index = this.getUnsafeBlockIndex(x, y, z)
    return this.blocks[index]
  }

  public setBlock(x: number, y: number, z: number, block: number) {
    const index = this.getBlockIndex(x, y, z)
    if (index === -1) throw new Error(`Couldn't set block @[${x},${y},${z}] because position is outside of chunk`)
    this.blocks[index] = block
  }

  public setUnsafeBlock(x: number, y: number, z: number, block: number) {
    const index = this.getUnsafeBlockIndex(x, y, z)
    this.blocks[index] = block
  }
}
