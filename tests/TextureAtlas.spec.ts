import { TextureAtlas } from '../src/demo/TextureAtlas'

describe("textureAtlas", () => {
  test("it calculates correct texture uvs", () => {
    const atlas = new TextureAtlas(['stone', 'dirt', 'sand', 'grass_block_top', 'grass_block_side', 'cobblestone'], 'assets/textures/')
    expect(atlas.textureUvs.stone).toEqual({
      name: 'stone',
      u: [0, 0.25],
      v: [0.75, 1]
    })
  })
})
