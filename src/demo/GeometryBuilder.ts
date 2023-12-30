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

  private static crossVertices = [
    // left
    { pos: [- 1, - 1, - 1], norm: [- 0.5, 0, -.5], uv: [0, 0], },
    { pos: [1, - 1, 1], norm: [- 0.5, 0, -.5], uv: [1, 0], },
    { pos: [- 1, 1, - 1], norm: [- 0.5, 0, -.5], uv: [0, 1], },

    { pos: [- 1, 1, - 1], norm: [- 0.5, 0, -0.5], uv: [0, 1], },
    { pos: [1, - 1, 1], norm: [- 0.5, 0, -0.5], uv: [1, 0], },
    { pos: [1, 1, 1], norm: [- 0.5, 0, -0.5], uv: [1, 1], },

    // right
    { pos: [1, - 1, - 1], norm: [0.5, 0, 0.5], uv: [0, 0], },
    { pos: [-1, - 1, 1], norm: [0.5, 0, 0.5], uv: [1, 0], },
    { pos: [1, 1, - 1], norm: [0.5, 0, 0.5], uv: [0, 1], },

    { pos: [1, 1, - 1], norm: [0.5, 0, 0.5], uv: [0, 1], },
    { pos: [-1, - 1, 1], norm: [0.5, 0, 0.5], uv: [1, 0], },
    { pos: [-1, 1, 1], norm: [0.5, 0, 0.5], uv: [1, 1], },
  ]

  constructor() {
    // TODO: implement vertex indices
  }

  public getFace(x: number, y: number, z: number, faceIndex: number) {
    const vertexCount = 6
    const positions: number[] = Array(vertexCount * 3)
    const normals: number[] = Array(vertexCount * 3)
    const uvs: number[] = Array(vertexCount * 2)

    let index = 0;

    for (let i = faceIndex * 6; i < faceIndex * 6 + 6; i++) {
      const vertex = GeometryBuilder.vertices[i]

      const vertexPositions = vertex.pos.map((v, i) => v * 0.5 + [x, y, z][i % 3])
      const vertexNormals = vertex.norm

      positions[index * 3 + 0] = vertexPositions[0]
      positions[index * 3 + 1] = vertexPositions[1]
      positions[index * 3 + 2] = vertexPositions[2]

      normals[index * 3 + 0] = vertexNormals[0]
      normals[index * 3 + 1] = vertexNormals[1]
      normals[index * 3 + 2] = vertexNormals[2]

      uvs[index * 2 + 0] = vertex.uv[0]
      uvs[index * 2 + 1] = vertex.uv[1]

      index++
    }

    return { positions, normals, uvs }
  }

  public getCross(x: number, y: number, z: number) {
    const vertexCount = GeometryBuilder.crossVertices.length

    const positions: number[] = Array(vertexCount * 3)
    const normals: number[] = Array(vertexCount * 3)
    const uvs: number[] = Array(vertexCount * 2)

    let index = 0;

    for (let i = 0; i < vertexCount; i++) {
      const vertex = GeometryBuilder.crossVertices[i]

      const vertexPositions = vertex.pos.map((v, i) => v * 0.5 + [x, y, z][i % 3])
      const vertexNormals = vertex.norm

      positions[index * 3 + 0] = vertexPositions[0]
      positions[index * 3 + 1] = vertexPositions[1]
      positions[index * 3 + 2] = vertexPositions[2]

      normals[index * 3 + 0] = vertexNormals[0]
      normals[index * 3 + 1] = vertexNormals[1]
      normals[index * 3 + 2] = vertexNormals[2]

      uvs[index * 2 + 0] = vertex.uv[0]
      uvs[index * 2 + 1] = vertex.uv[1]

      index++
    }

    return { positions, normals, uvs }
  }
}
