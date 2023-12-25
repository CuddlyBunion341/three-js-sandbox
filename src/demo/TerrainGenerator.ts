import { NoiseFunction2D, createNoise2D } from "simplex-noise"
import alea from "alea"

class LayeredNoise {
  private baseFrequency = 0.005
  private baseAmplitude = 20
  private octaves = 4
  private octaveFactor = 2

  private noise: NoiseFunction2D

  constructor(seed = 0) {
    const prng = alea(seed)
    const noise = createNoise2D(prng)
    this.noise = noise
  }

  sample2d(x: number, z: number) {
    let value = 0

    for (let o = 1; o <= this.octaves; o++) {
      value += this.noise(
        x * this.baseFrequency * this.octaveFactor * o,
        z * this.baseFrequency * this.octaveFactor * o
      ) * this.baseAmplitude / (this.octaveFactor * o)
    }

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
