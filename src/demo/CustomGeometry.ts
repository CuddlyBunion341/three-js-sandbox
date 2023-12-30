import * as THREE from 'three'
import { FastArray } from "./FastArray";

export type CustomGeometryOptions = {
  positions?: boolean
  normals?: boolean
  colors?: boolean
  uvs?: boolean
}

const defaultGeometryOptions: CustomGeometryOptions = {
  positions: true,
  normals: true,
  colors: true,
  uvs: true,
}

export class CustomGeometry {
  public static readonly positionsSize = 3
  public static readonly normalsSize = 3
  public static readonly colorsSize = 3
  public static readonly uvsSize = 2

  public positions?: FastArray<number>
  public normals?: FastArray<number>
  public colors?: FastArray<number>
  public uvs?: FastArray<number>

  constructor(vertexCount: number, options: CustomGeometryOptions = {}) {
    options = { ...defaultGeometryOptions, ...options }

    if (options.positions) this.positions = new FastArray(Math.floor(vertexCount * CustomGeometry.positionsSize / 10))
    if (options.normals) this.normals = new FastArray(Math.floor(vertexCount * CustomGeometry.normalsSize / 10))
    if (options.colors) this.colors = new FastArray(Math.floor(vertexCount * CustomGeometry.colorsSize / 10))
    if (options.uvs) this.uvs = new FastArray(Math.floor(vertexCount * CustomGeometry.uvsSize / 10))
  }

  public generateBufferGeometry() {
    const geometry = new THREE.BufferGeometry()

    if (this.positions) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.positions.shorten()), CustomGeometry.positionsSize)
      geometry.setAttribute('position', attribute)
    }
    if (this.normals) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.normals.shorten()), CustomGeometry.normalsSize)
      geometry.setAttribute('normal', attribute)
    }
    if (this.colors) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.colors.shorten()), CustomGeometry.colorsSize)
      geometry.setAttribute('color', attribute)
    }
    if (this.uvs) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.uvs.shorten()), CustomGeometry.uvsSize)
      geometry.setAttribute('uv', attribute)
    }

    return geometry
  }
}
