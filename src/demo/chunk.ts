import { ChunkMesher } from "./ChunkMesher"

export class Chunk extends ChunkMesher {
  public generateTerrain() {
    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Math.random() * 50; y++) {
        for (let z = 0; z < Chunk.DEPTH; z++) {
          const index = this.getUnsafeBlockIndex(x, y, z)
          this.blocks[index] = 1
        }
      }
    }
  }
}
