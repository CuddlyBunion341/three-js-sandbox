import { Chunk } from "./Chunk"
import { TerrainGenerator } from "./TerrainGenerator"

export class World {
  private terrainGenerator: TerrainGenerator

  private chunks: Chunk[]

  constructor(seed: number) {
    this.terrainGenerator = new TerrainGenerator(seed)
    this.chunks = []
  }

  public getChunk(x: number, z: number) {
    return this.chunks.find(chunk => chunk.x === x && chunk.z === z)
  }

  public generateChunk(x: number, z: number) {
    if (this.getChunk(x, z)) return null

    const chunk = new Chunk(x, z, this.terrainGenerator)
    this.chunks.push(chunk)

    return chunk
  }
}
