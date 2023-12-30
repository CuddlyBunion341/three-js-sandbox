import { DoubleSide, MeshBasicMaterial, MeshMatcapMaterial, RawShaderMaterial, ShaderMaterial, Texture } from "three";
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
// export const transparentMaterial = new MeshBasicMaterial({ wireframe: true, transparent: true, side: DoubleSide })
export const waterMaterial = new RawShaderMaterial({
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  
  attribute vec3 position;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y -= 0.125;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }
  `,
  fragmentShader: `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(0.0, 0.5, 0.5, 0.5);
  }`, transparent: true
})


// const debugTexture = new Texture()
// export const transparentMaterial = new MeshBasicMaterial({ map: debugTexture })
// const image = document.createElement('img')
// image.src = 'assets/textures/uv_test.png'
// image.onload = () => {
//   debugTexture.image = image
//   debugTexture.needsUpdate = true
//   transparentMaterial.needsUpdate = true
// }
