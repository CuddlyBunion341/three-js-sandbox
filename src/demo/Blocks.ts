export const uniqueTextures: Set<string> = new Set()

function allSides(texture: string) {
  uniqueTextures.add(texture)
  return [texture, texture, texture, texture, texture, texture]
}

function topSideBottom(top: string, side: string, bottom: string) {
  uniqueTextures.add(top)
  uniqueTextures.add(side)
  uniqueTextures.add(bottom)

  return [side, side, side, side, bottom, top]
}

export type BlockTexture = {
  name: string
  u: number[]
  v: number[]
}

export type BlockProperty = {
  opaque: boolean
  textures?: BlockTexture[]
}

export class Block {
  private static blockCount = 0

  public readonly id: number
  public readonly name: string
  public readonly opaque: boolean
  public readonly textures: BlockTexture[]

  constructor(name: string, opaque: boolean, textureNames: string[]) {
    this.id = Block.blockCount++
    this.name = name
    this.opaque = opaque
    this.textures = textureNames.map(name => ({
      name,
      u: [0, 0],
      v: [0, 0]
    }))
  }
}

export const blocks = [
  new Block('air', false, []),
  new Block('stone', true, allSides('stone')),
  new Block('dirt', true, allSides('dirt')),
  new Block('sand', true, allSides('sand')),
  new Block('grass', true, topSideBottom('grass_block_top', 'grass_block_side', 'dirt')),
  new Block('cobblestone', true, allSides('cobblestone')),
  new Block('water', false, allSides('water'))
]

export const BlockTypes = (() => {
  const hash: Record<string, number> = {}

  blocks.forEach((block) => {
    hash[block.name.toUpperCase()] = block.id
  })

  return hash
})()
