import { NoiseFunction2D, createNoise2D } from "simplex-noise"
import alea from "alea"

export class TerrainGenerator {
  private seed: number
  private noise: NoiseFunction2D
  // private noise: any

  constructor(seed = 0) {
    this.seed = seed

    const prng = alea(seed)
    const noise = createNoise2D(prng)
    this.noise = noise
  }

  public getBlock(x: number, y: number, z: number) {
    // const frequency = 1 / ChunkData.WIDTH * 2
    // const amplitude = 5

    // const xOffset = Math.sin(x * frequency) * amplitude
    // const zOffset = Math.sin(z * frequency) * amplitude

    // const surfaceY = 10 + xOffset + zOffset

    const frequency = 0.01
    const amplitude = 5
    const minSurfaceY = 10
    const surfaceY = minSurfaceY + this.noise(x * frequency, z * frequency) * amplitude

    return (y < surfaceY) ? 1 : 0
  }
}
