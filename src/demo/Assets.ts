import { DoubleSide, MeshBasicMaterial, MeshMatcapMaterial, Texture } from "three";
import { TextureAtlas } from "./TextureAtlas";
import { blocks, uniqueTextures } from "./Blocks";

// update blocks with texture information
const atlas = new TextureAtlas(Array.from(uniqueTextures), 'assets/textures/')
atlas.generateTextureAtlas()

blocks.forEach(block => {
  block.textures.forEach((blockTexture, index) => {
    const { name } = blockTexture

    if (!atlas.textureUvs[name]) throw new Error(`Texture ${name} is not loaded!`)

    block.textures[index] = {
      name,
      u: atlas.textureUvs[name].u,
      v: atlas.textureUvs[name].v
    }
  })
})

export const opaqueMaterial = new MeshMatcapMaterial({ map: atlas.texture, vertexColors: true })
export const transparentMaterial = new MeshMatcapMaterial({ map: atlas.texture, transparent: true, side: DoubleSide })
