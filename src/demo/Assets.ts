import { DoubleSide, MeshBasicMaterial, MeshMatcapMaterial } from "three";
import { TextureAtlas } from "./TextureAtlas";
import { blocks, uniqueTextures } from "./Blocks";

// update blocks with texture information
const atlas = new TextureAtlas(Array.from(uniqueTextures), 'assets/textures/')
atlas.generateTextureAtlas()

blocks.forEach(block => {
  block.textures.forEach((blockTexture, index) => {
    const { name } = blockTexture

    block.textures[index] = {
      name,
      u: atlas.textureUvs[name].u,
      v: atlas.textureUvs[name].v
    }
  })
})

export const opaqueMaterial = new MeshMatcapMaterial({ map: atlas.texture, vertexColors: true })
export const transparentMaterial = new MeshBasicMaterial({ map: atlas.texture, vertexColors: true, transparent: true, side: DoubleSide })
