import { ChunkMesher } from "./ChunkMesher"
import { TerrainGenerator } from "./TerrainGenerator"

export class Chunk extends ChunkMesher {
  private readonly terrainGenerator: TerrainGenerator

  constructor(x: number, z: number, terrainGenerator: TerrainGenerator) {
    super(x, z)
    this.terrainGenerator = terrainGenerator
    this.generateTerrain()
  }

  public generateTerrain() {
    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let z = 0; z < Chunk.DEPTH; z++) {
        for (let y = 0; y < Chunk.HEIGHT; y++) {
          const vx = this.x * Chunk.WIDTH + x
          const vy = y
          const vz = this.z * Chunk.DEPTH + z
          const block = this.terrainGenerator.getBlock(vx, vy, vz)
          this.setUnsafeBlock(x, y, z, block)
        }
      }
    }
  }
}
