import { NoiseFunction2D, NoiseFunction3D, createNoise2D, createNoise3D } from "simplex-noise"
import alea from "alea"
import Spline from "typescript-cubic-spline"
import { AIR, STONE } from "./Blocks"
import { NoiseVisualizer } from "./NoiseVisualizer"

export class LayeredNoise {
  private baseFrequency = 0.005
  private baseFrequency3d = 0.001

  private baseAmplitude = 20
  private octaves = 4
  private octaveFactor = 2

  private spline: Spline

  private noise2d: NoiseFunction2D
  private noise3d: NoiseFunction3D

  constructor(seed = 0) {
    const prng = alea(seed)
    this.noise2d = createNoise2D(prng)
    this.noise3d = createNoise3D(prng)

    const xs = [-1, 0.3, 0.4, 1]
    const ys = [0, 5, 16, 16]
    this.spline = new Spline(xs, ys)
  }

  sample2d(x: number, z: number) {
    let value = 0

    for (let o = 1; o <= this.octaves; o++) {
      value += this.noise2d(
        x * this.baseFrequency * this.octaveFactor * o,
        z * this.baseFrequency * this.octaveFactor * o
      ) * this.baseAmplitude / (this.octaveFactor * o)
    }

    return value
  }

  sample3d(x: number, y: number, z: number) {
    let value = 0

    for (let o = 1; o <= 8; o++) {
      value += this.noise3d(
        x * this.baseFrequency3d * this.octaveFactor * o,
        y * this.baseFrequency3d * this.octaveFactor * o * 2,
        z * this.baseFrequency3d * this.octaveFactor * o,
      ) * this.baseAmplitude / (this.octaveFactor * o)
    }

    return value
  }
}

export class TerrainGenerator {
  private noise: LayeredNoise

  constructor(seed = 0) {
    this.noise = new LayeredNoise(seed)

    const visualizer = new NoiseVisualizer(256, 256, (x, y) => this.noise.sample2d(x, y), { min: -14, max: 10 })
    const url = visualizer.generateMap()

    const img = document.createElement('img')
    img.src = url

    document.body.appendChild(img)
    img.style = "width: 100%; height: 100%; position: absolute; top: 0; left: 0; image-rendering: pixelated; object-fit: contain"
  }

  public getBlock(x: number, y: number, z: number) {
    const continentalNess = this.noise.sample2d(x, z)
    const minSurfaceY = 64

    const density = this.noise.sample3d(x, y, z)

    const caveWidth = 2


    const caveAir = (density > 0 - caveWidth && density < 0 + caveWidth)
    const atSurfaceLevel = (y < minSurfaceY + continentalNess)

    return (atSurfaceLevel && !caveAir) ? STONE : AIR
  }
}
