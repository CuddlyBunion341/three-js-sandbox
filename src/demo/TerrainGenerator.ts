import { NoiseFunction2D, NoiseFunction3D, createNoise2D, createNoise3D } from "simplex-noise"
import alea from "alea"
import Spline from "typescript-cubic-spline"
import { NoiseVisualizer } from "./NoiseVisualizer"
import { BlockTypes } from "./Blocks"

export class LayeredNoise {
  public baseFrequency = 0.005
  public baseFrequency3d = 0.01

  public baseAmplitude = 20
  public octaves = 4
  public persistence = 2

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
        x * this.baseFrequency * this.persistence * o,
        z * this.baseFrequency * this.persistence * o
      ) * this.baseAmplitude / (this.persistence * o)
    }

    return value
  }

  sample3d(x: number, y: number, z: number) {
    let value = 0

    for (let o = 1; o <= 8; o++) {
      value += this.noise3d(
        x * this.baseFrequency3d * this.persistence * o,
        y * this.baseFrequency3d * this.persistence * o * 2,
        z * this.baseFrequency3d * this.persistence * o,
      ) * this.baseAmplitude / (this.persistence * o)
    }

    return value
  }
}

export class TerrainGenerator {
  private noise: LayeredNoise
  // private coalNoise: LayeredNoise

  constructor(seed = 0) {
    this.noise = new LayeredNoise(seed)
    // this.coalNoise = new LayeredNoise(seed)
    // this.coalNoise.baseFrequency3d = 0.001

    // const visualizer = new NoiseVisualizer(256, 256, (x, y) => this.noise.sample2d(x, y), { min: -14, max: 10 })
    // const url = visualizer.generateMap()

    // const img = document.createElement('img')
    // img.src = url

    // document.body.appendChild(img)
    // img.style = "width: 100%; height: 100%; position: absolute; top: 0; left: 0; image-rendering: pixelated; object-fit: contain"
  }

  public getBlock(x: number, y: number, z: number) {
    const continentalNess = this.noise.sample2d(x, z)
    const minSurfaceY = 64

    // const coalDensity = this.coalNoise.sample3d(x, y, z)
    // if (coalDensity > 10) return BlockTypes.COAL_ORE

    const density = this.noise.sample3d(x, y, z)

    const caveAir = (density > 10)

    if (caveAir) return BlockTypes.AIR

    const surfaceLevel = minSurfaceY + continentalNess

    const belowSurfaceLevel = (y < surfaceLevel)
    const atSurfaceLevel = (y === Math.floor(surfaceLevel))
    const atVegetationLayer = (y === Math.floor(surfaceLevel) + 1)
    const aboveSurfaceLevel = (y > surfaceLevel)
    const underSeaLevel = (y < 60)

    if ((atSurfaceLevel || belowSurfaceLevel && y + 3 > surfaceLevel) && underSeaLevel) return BlockTypes.SAND
    if (aboveSurfaceLevel && underSeaLevel) return BlockTypes.WATER

    if (atVegetationLayer && Math.random() < 0.1) {
      if (Math.random() < 0.1) return BlockTypes.ROSE
      return BlockTypes.GRASS
    }

    if (atSurfaceLevel) {
      return BlockTypes.GRASS_BLOCK
    }

    if (belowSurfaceLevel) {
      if (surfaceLevel - y < 5) return BlockTypes.DIRT
      if (y === 0) return BlockTypes.COBBLESTONE
      return BlockTypes.STONE
    }

    return BlockTypes.AIR
  }
}
