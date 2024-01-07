import { DoubleSide, FrontSide, MeshDepthMaterial, MeshPhysicalMaterial } from "three";
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

export const opaqueMaterial = new MeshPhysicalMaterial({ map: atlas.texture, vertexColors: true, side: FrontSide })
export const transparentMaterial = new MeshPhysicalMaterial({ map: atlas.texture, transparent: true, side: DoubleSide, alphaMap: atlas.texture, alphaTest: 0.005 })
// export const transparentMaterial = new MeshBasicMaterial({ wireframe: true, transparent: true, side: DoubleSide })
// export const waterMaterial = new RawShaderMaterial({
//   vertexShader: `
//   uniform mat4 projectionMatrix;
//   uniform mat4 viewMatrix;
//   uniform mat4 modelMatrix;

//   attribute vec3 position;
//   attribute vec2 uv;

//   varying vec2 vUv;
//   varying vec3 vPos;

//   void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     modelPosition.y -= 0.125;
//     vec4 viewPosition = viewMatrix * modelPosition;
//     gl_Position = projectionMatrix * viewPosition;
//     vUv = uv;
//     vPos = position;
//   }
//   `,
//   fragmentShader: `
//   precision mediump float;

//   varying vec2 vUv;
//   varying vec3 vPos;
//   uniform sampler2D texture;

//   void main() {
//     gl_FragColor = texture2D(texture, vUv);
//     // gl_FragColor = vec4(vPos.x / 32.0, 0.5,1,1);
//   }`, transparent: true
// })

export const waterMaterial = new MeshDepthMaterial({ map: atlas.texture, transparent: true, side: DoubleSide })

// const debugTexture = new Texture()
// export const transparentMaterial = new MeshBasicMaterial({ map: debugTexture })
// const image = document.createElement('img')
// image.src = 'assets/textures/uv_test.png'
// image.onload = () => {
//   debugTexture.image = image
//   debugTexture.needsUpdate = true
//   transparentMaterial.needsUpdate = true
// }
