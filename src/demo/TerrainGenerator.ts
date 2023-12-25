export class TerrainGenerator {
  private seed: number

  constructor(seed = 0) {
    this.seed = seed
  }

  public getBlock(x: number, y: number, z: number) {
    return Number(Math.random() < 0.2)
  }
}
