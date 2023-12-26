import { DisplayP3ColorSpace, NearestFilter, Texture } from "three"

export type TextureUvs = Record<string, { u: [number, number], v: [number, number] }>

export class TextureAtlas {
  static readonly textureSize = 16
  static readonly fileExtension = '.png'

  public readonly texture: Texture
  public readonly textureUvs: TextureUvs

  private readonly size: number
  private readonly fileNames: string[]
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly basePath: string

  constructor(fileNames: string[], basePath: string) {
    this.fileNames = fileNames
    this.basePath = basePath

    this.size = Math.ceil(Math.sqrt(fileNames.length))
    if (this.size % 2 !== 0) this.size++

    this.textureUvs = this.calculateTextureUvs()

    const canvas = this.prepareCanvas()
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    if (ctx === null) throw new Error(`Canvas rendering context could not be retireved!`)

    this.ctx = ctx

    this.texture = new Texture()
    this.texture.magFilter = NearestFilter
    this.texture.minFilter = NearestFilter
    this.texture.colorSpace = DisplayP3ColorSpace
  }

  private calculateTextureUvs() {
    const textureUvs: TextureUvs = {}

    let index = 0;

    // TODO: Dryify
    (() => {
      const uvFactor = 1 / this.size

      for (let x = 0; x < this.size; x++) {
        for (let z = 0; z < this.size; z++) {
          textureUvs[this.fileNames[index]] = {
            u: [x * uvFactor, (x + 1) * uvFactor],
            v: [1 - z * uvFactor, 1 - (z + 1) * uvFactor],
          }

          if (++index >= this.fileNames.length) return
        }
      }
    }
    )()

    return textureUvs
  }

  private loadImages() {
    return Promise.all(this.fileNames.map((filename): Promise<HTMLImageElement> => {
      const image = document.createElement('img')
      image.src = `${this.basePath}${filename}${TextureAtlas.fileExtension}`

      return new Promise((resolve, reject) => {
        image.addEventListener('load', () => {
          resolve(image)
        })

        image.addEventListener('error', (error) => {
          reject(error)
        })
      })
    }))
  }

  public async generateTextureAtlas() {
    const images = await this.loadImages()
    this.drawImages(images)

    this.texture.image = this.canvas
    this.texture.needsUpdate = true

    return this.texture
  }

  private drawImages(images: HTMLImageElement[]) {
    let index = 0;

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        this.drawImage(z, x, images[index])

        if (++index >= this.fileNames.length) return
      }
    }
  }

  private drawImage(x: number, z: number, image: HTMLImageElement) {
    this.ctx.drawImage(image, x * TextureAtlas.textureSize, z * TextureAtlas.textureSize)
  }

  private prepareCanvas() {
    const canvas = document.createElement('canvas')

    canvas.width = this.size * TextureAtlas.textureSize
    canvas.height = this.size * TextureAtlas.textureSize

    return canvas
  }
}
