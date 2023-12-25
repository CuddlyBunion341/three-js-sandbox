import Spline from "typescript-cubic-spline"
// import { LayeredNoise } from "../src/demo/TerrainGenerator"

describe("TerrainGenerator", () => {
  test("splines correctly", () => {
    // const noise = new LayeredNoise(0)
    // const value = noise.sample2d(0, 0)

    const xs = [-1, 1]
    const xy = [0, 50]

    const spline = new Spline(xs, xy)

    expect(spline.at(-1)).toBe(0)
    expect(spline.at(1)).toBe(50)
  })
})
