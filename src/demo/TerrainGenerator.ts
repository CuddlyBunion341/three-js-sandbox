import { ChunkData } from "./ChunkData"

export class TerrainGenerator {
  private seed: number
  // private noise: any

  constructor(seed = 0) {
    this.seed = seed
  }

  public getBlock(x: number, y: number, z: number) {
    const frequency = 0.1
    const amplitude = 5

    const xOffset = Math.sin(x * frequency) * amplitude
    const zOffset = Math.sin(z * frequency) * amplitude

    const surfaceY = 10 + xOffset + zOffset

    return (y < surfaceY) ? 1 : 0
  }
}
