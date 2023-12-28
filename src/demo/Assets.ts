import { MeshBasicMaterial, MeshMatcapMaterial } from "three";
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

export const material = new MeshBasicMaterial({ map: atlas.texture, wireframe: false, vertexColors: true, transparent: true })
