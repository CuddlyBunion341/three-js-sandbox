import { Texture } from "three"

export class TextureAtlas {
  static textureSize = 16

  private readonly size: number
  private readonly fileNames: string[]
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  constructor(fileNames: string[]) {
    this.fileNames = fileNames
    this.size = Math.ceil(Math.sqrt(fileNames.length))

    const canvas = this.prepareCanvas()
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    if (ctx === null) throw new Error(`Canvas rendering context could not be retireved!`)

    this.ctx = ctx
  }

  private loadImages() {
    return Promise.all(this.fileNames.map((filename): Promise<HTMLImageElement> => {
      const image = document.createElement('img')
      image.src = filename

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

    return new Texture(this.canvas)
  }

  private drawImages(images: HTMLImageElement[]) {
    let index = 0;

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        this.drawImage(x, z, images[index])

        if (index++ >= this.fileNames.length) return
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
