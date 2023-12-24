type GeometryData = {
  positions: number[]
  normals: number[]
  uvs: number[]
  indices: number[]
}

export class GeometryBuilder {
  private static vertices = [
    // left
    { pos: [- 1, - 1, - 1], norm: [- 1, 0, 0], uv: [0, 0], },
    { pos: [- 1, - 1, 1], norm: [- 1, 0, 0], uv: [1, 0], },
    { pos: [- 1, 1, - 1], norm: [- 1, 0, 0], uv: [0, 1], },

    { pos: [- 1, 1, - 1], norm: [- 1, 0, 0], uv: [0, 1], },
    { pos: [- 1, - 1, 1], norm: [- 1, 0, 0], uv: [1, 0], },
    { pos: [- 1, 1, 1], norm: [- 1, 0, 0], uv: [1, 1], },
    // right
    { pos: [1, - 1, 1], norm: [1, 0, 0], uv: [0, 0], },
    { pos: [1, - 1, - 1], norm: [1, 0, 0], uv: [1, 0], },
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },

    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },
    { pos: [1, - 1, - 1], norm: [1, 0, 0], uv: [1, 0], },
    { pos: [1, 1, - 1], norm: [1, 0, 0], uv: [1, 1], },
    // back
    { pos: [1, - 1, - 1], norm: [0, 0, - 1], uv: [0, 0], },
    { pos: [- 1, - 1, - 1], norm: [0, 0, - 1], uv: [1, 0], },
    { pos: [1, 1, - 1], norm: [0, 0, - 1], uv: [0, 1], },

    { pos: [1, 1, - 1], norm: [0, 0, - 1], uv: [0, 1], },
    { pos: [- 1, - 1, - 1], norm: [0, 0, - 1], uv: [1, 0], },
    { pos: [- 1, 1, - 1], norm: [0, 0, - 1], uv: [1, 1], },
    // front
    { pos: [- 1, - 1, 1], norm: [0, 0, 1], uv: [0, 0], },
    { pos: [1, - 1, 1], norm: [0, 0, 1], uv: [1, 0], },
    { pos: [- 1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },

    { pos: [- 1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },
    { pos: [1, - 1, 1], norm: [0, 0, 1], uv: [1, 0], },
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], },
    // bottom
    { pos: [1, - 1, 1], norm: [0, - 1, 0], uv: [0, 0], },
    { pos: [- 1, - 1, 1], norm: [0, - 1, 0], uv: [1, 0], },
    { pos: [1, - 1, - 1], norm: [0, - 1, 0], uv: [0, 1], },

    { pos: [1, - 1, - 1], norm: [0, - 1, 0], uv: [0, 1], },
    { pos: [- 1, - 1, 1], norm: [0, - 1, 0], uv: [1, 0], },
    { pos: [- 1, - 1, - 1], norm: [0, - 1, 0], uv: [1, 1], },
    // top
    { pos: [1, 1, - 1], norm: [0, 1, 0], uv: [0, 0], },
    { pos: [- 1, 1, - 1], norm: [0, 1, 0], uv: [1, 0], },
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },

    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },
    { pos: [- 1, 1, - 1], norm: [0, 1, 0], uv: [1, 0], },
    { pos: [- 1, 1, 1], norm: [0, 1, 0], uv: [1, 1], },
  ]

  private vertexCount: number

  constructor() {
    this.vertexCount = 0
  }

  getGeometry(x: number, y: number, z: number, faceMask: boolean[]): GeometryData {
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    console.log(faceMask)

    GeometryBuilder.vertices.forEach(({ pos, norm, uv }, index) => {
      if (!faceMask[Math.floor(index / 6)]) return
      console.log(index, Math.floor(index / 6))

      positions.push(...pos.map((v, i) => v * 0.5 + [x, y, z][i % 3] * 3))
      normals.push(...norm)
      uvs.push(...uv)
    })

    return { positions, normals, uvs, indices }
  }
}
