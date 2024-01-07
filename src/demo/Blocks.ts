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

function cross(texture: string) {
  uniqueTextures.add(texture)
  return [texture, texture]
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

export type BlockShape = 'empty' | 'block' | 'cross'

export class Block {
  private static blockCount = 0

  public readonly id: number
  public readonly name: string
  public readonly opaque: boolean
  public readonly textures: BlockTexture[]
  public readonly shape: BlockShape

  constructor(name: string, shape: BlockShape, opaque: boolean, textureNames: string[]) {
    this.id = Block.blockCount++
    this.name = name
    this.opaque = opaque
    this.shape = shape
    this.textures = textureNames.map(name => ({
      name,
      u: [0, 0],
      v: [0, 0]
    }))
  }
}

export const blocks = [
  new Block('air', 'empty', false, []),
  new Block('stone', 'block', true, allSides('stone')),
  new Block('dirt', 'block', true, allSides('dirt')),
  new Block('sand', 'block', true, allSides('sand')),
  new Block('grass_block', 'block', true, topSideBottom('grass_block_top', 'grass_block_side', 'dirt')),
  new Block('cobblestone', 'block', true, allSides('cobblestone')),
  new Block('water', 'block', false, allSides('water')),
  // new Block('rose', 'block', false, allSides('flower_rose')),
  // new Block('grass', 'block', false, allSides('grass')),
  new Block('rose', 'cross', false, cross('flower_rose')),
  new Block('grass', 'cross', false, cross('grass')),
  new Block('coal_ore', 'block', false, allSides('coal_block')),
]

export const BlockTypes = (() => {
  const hash: Record<string, number> = {}

  blocks.forEach((block) => {
    hash[block.name.toUpperCase()] = block.id
  })

  return hash
})()
