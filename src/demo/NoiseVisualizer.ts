import { NoiseFunction2D } from "simplex-noise";
import Spline from "typescript-cubic-spline";

type NumberRange = {
  min: number
  max: number
}

export class NoiseVisualizer {
  private readonly width: number
  private readonly height: number
  private readonly noiseFunction: NoiseFunction2D

  private readonly noiseRange: NumberRange

  constructor(width: number, height: number, noiseFunction: NoiseFunction2D, noiseRange: NumberRange) {
    this.width = width
    this.height = height
    this.noiseFunction = noiseFunction
    this.noiseRange = noiseRange
  }

  public generateMap() {
    const canvas = this.prepareCanvas()
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Canvas ctx not supported!')

    const xs = [this.noiseRange.min, this.noiseRange.max]
    const ys = [0, 255]
    const spline = new Spline(xs, ys)

    let max = 0
    let min = 255

    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.height; z++) {
        const y = this.noiseFunction(x, z)

        const channelValue = spline.at(y)

        if (channelValue <= 0) throw new Error('Value too big! Increase max!')
        if (channelValue >= 255) throw new Error('Value too small! Increase min!')

        if (channelValue > max) max = channelValue
        if (channelValue < min) min = channelValue

        ctx.fillStyle = `rgb(${channelValue}, ${channelValue}, ${channelValue})`
        ctx.fillRect(x, z, 1, 1)
      }
    }

    console.log("report:", { min, max })

    return canvas.toDataURL()
  }

  private prepareCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height

    canvas.style.imageRendering = 'pixelated'

    return canvas
  }
}
