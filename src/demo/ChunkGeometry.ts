import * as THREE from 'three'

type GeometryData = {
  positions: number[]
  normals: number[]
  colors: number[]
  uvs: number[]
}

export class ChunkGeometry {
  public readonly allPositions: number[]
  public readonly allNormals: number[]
  public readonly allColors: number[]
  public readonly allUvs: number[]

  private lastIndex: number

  constructor(maxVertices: number) {
    this.allPositions = Array(maxVertices * 3)
    this.allNormals = Array(maxVertices * 3)
    this.allColors = Array(maxVertices * 3)
    this.allUvs = Array(maxVertices * 2)

    this.lastIndex = 0
  }

  public streamVertexData(data: GeometryData) {
    const { positions, normals, colors, uvs } = data

    if (positions.length !== 3) throw new Error('Positions array wrong length!')
    if (normals.length !== 3) throw new Error('Normals array wrong length!')
    if (colors.length !== 3) throw new Error('Colors array wrong length!')
    if (uvs.length !== 2) throw new Error('Uvs array wrong length!')

    for (let i = 0; i < 3; i++) {
      this.allPositions[this.lastIndex * 3 + i] = positions[i]
      this.allNormals[this.lastIndex * 3 + i] = normals[i]
      this.allColors[this.lastIndex * 3 + i] = colors[i]
    }

    for (let i = 0; i < 2; i++) {
      this.allUvs[this.lastIndex * 2 + i] = uvs[i]
    }

    this.lastIndex++
  }

  public get slicedData() {
    const positions = this.allPositions.slice(0, this.lastIndex * 3)
    const normals = this.allNormals.slice(0, this.lastIndex * 3)
    const colors = this.allColors.slice(0, this.lastIndex * 3)
    const uvs = this.allUvs.slice(0, this.lastIndex * 2)

    return { positions, normals, colors, uvs }
  }

  public get bufferGeometry() {
    const geometry = new THREE.BufferGeometry()

    const { positions, normals, colors, uvs } = this.slicedData

    const positionsBuffer = new THREE.BufferAttribute(new Float32Array(positions), 3)
    const normalsBuffer = new THREE.BufferAttribute(new Float32Array(normals), 3)
    const colorsBuffer = new THREE.BufferAttribute(new Float32Array(colors), 3)
    const uvsBuffer = new THREE.BufferAttribute(new Float32Array(uvs), 2)

    geometry.setAttribute('position', positionsBuffer)
    geometry.setAttribute('normal', normalsBuffer)
    geometry.setAttribute('color', colorsBuffer)
    geometry.setAttribute('uv', uvsBuffer)

    return geometry
  }
}
