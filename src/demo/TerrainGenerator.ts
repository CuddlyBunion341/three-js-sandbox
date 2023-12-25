import { NoiseFunction2D, createNoise2D } from "simplex-noise"
import alea from "alea"

class LayeredNoise {
  private baseFrequency = 0.01
  private baseAmplitude = 5
  private octaves: number

  private noise: NoiseFunction2D

  constructor(seed = 0, octaves = 1) {
    const prng = alea(seed)
    const noise = createNoise2D(prng)
    this.octaves = octaves
    this.noise = noise
  }

  sample2d(x: number, z: number) {
    const value = this.noise(x * this.baseFrequency, z * this.baseFrequency) * this.baseAmplitude
    return value
  }
}

export class TerrainGenerator {
  private noise: LayeredNoise

  constructor(seed = 0) {
    this.noise = new LayeredNoise(seed)
  }

  public getBlock(x: number, y: number, z: number) {
    const minSurfaceY = 10
    const surfaceY = minSurfaceY + this.noise.sample2d(x, z)

    return (y < surfaceY) ? 1 : 0
  }
}
