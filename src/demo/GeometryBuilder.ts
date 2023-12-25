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

  constructor() {
    // TODO: implement vertex indices
  }

  getGeometry(x: number, y: number, z: number, faceMask: boolean[]): GeometryData {
    // 2 triangles * 3 vertices per triangle * 6 faces
    const maxVertices = 2 * 3 * 6

    const positions: number[] = Array(maxVertices * 3)
    const normals: number[] = Array(maxVertices * 3)
    const uvs: number[] = Array(maxVertices * 2)
    const indices: number[] = Array(maxVertices)

    let lastIndex = 0

    GeometryBuilder.vertices.forEach(({ pos, norm, uv }, index) => {
      if (!faceMask[Math.floor(index / 6)]) return

      const vertexPositions = pos.map((v, i) => v * 0.5 + [x, y, z][i % 3] * 1.2)
      positions[lastIndex * 3 + 0] = vertexPositions[0]
      positions[lastIndex * 3 + 1] = vertexPositions[1]
      positions[lastIndex * 3 + 2] = vertexPositions[2]

      normals[lastIndex * 3 + 0] = norm[0]
      normals[lastIndex * 3 + 1] = norm[1]
      normals[lastIndex * 3 + 2] = norm[2]

      uvs[lastIndex * 2 + 0] = uv[0]
      uvs[lastIndex * 2 + 1] = uv[1]

      indices[lastIndex] = index

      lastIndex++
    })

    const slicedPositions = positions.slice(0, lastIndex * 3)
    const slicedNormals = normals.slice(0, lastIndex * 3)
    const slicedUvs = uvs.slice(0, lastIndex * 2)
    const slicedIndices = indices.slice(0, lastIndex)

    return { positions: slicedPositions, normals: slicedNormals, uvs: slicedUvs, indices: slicedIndices }
  }
}
