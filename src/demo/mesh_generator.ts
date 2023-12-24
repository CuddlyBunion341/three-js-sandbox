export class GeometryBuilder {

  private static indices = [
    // left
    0, 2, 6,
    0, 4, 6,
    // right
    1, 3, 7,
    1, 5, 7,
    // front
    0, 2, 3,
    0, 1, 3,
    // back
    4, 6, 7,
    4, 5, 7,
    // top
    2, 6, 7,
    2, 3, 7,
    // bottom
    0, 4, 5,
    0, 1, 5,
  ]

  private static positions = [
    -1, -1, 1, // 0
    1, -1, 1, // 1
    -1, 1, 1, // 2
    1, 1, 1, // 3
    -1, -1, -1, // 4
    1, -1, -1, // 5
    -1, 1, -1, // 6
    1, 1, -1 // 7
  ]

  private vertexCount: number

  constructor() {
    this.vertexCount = 0
  }

  getGeometry(x: number, y: number, z: number, faceMask: boolean[]) {
    const indices = GeometryBuilder.indices.filter((_, i) => {
      return faceMask[Math.floor(i / 6)]
      return true
    }).map((v => v + this.vertexCount))

    const positions = GeometryBuilder.positions.map((v, i) => {
      return [x, y, z][i % 3] + v
    })

    // this.vertexCount += GeometryBuilder.positions.length / 3

    return { positions: positions, indices: indices }
  }
}
