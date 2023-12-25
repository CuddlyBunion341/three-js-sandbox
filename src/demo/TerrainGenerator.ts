export class TerrainGenerator {
  private seed: number

  constructor(seed = 0) {
    this.seed = seed
  }

  public getBlock(x: number, y: number, z: number) {
    const newLocal = Number(y < Math.sin((x * z) / 5) * 2)
    return newLocal
  }
}
