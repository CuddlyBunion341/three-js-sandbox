import { ChunkMesher } from "./ChunkMesher"
import { TerrainGenerator } from "./TerrainGenerator"

export class Chunk extends ChunkMesher {
  private terrainGenerator: TerrainGenerator

  constructor(x: number, z: number, terrainGenerator: TerrainGenerator) {
    super(x, z)
    this.terrainGenerator = terrainGenerator
  }

  public generateTerrain() {
    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Math.random() * 50; y++) {
        for (let z = 0; z < Chunk.DEPTH; z++) {
          const index = this.getUnsafeBlockIndex(x, y, z)
          this.blocks[index] = this.terrainGenerator.getBlock(x, y, z)
        }
      }
    }
  }
}
