import * as THREE from 'three'
import { FastArray } from "./FastArray";

export type CustomGeometryOptions = {
  positions: boolean
  normals: boolean
  colors: boolean
  uvs: boolean
}

const defaultGeometryOptions: CustomGeometryOptions = {
  positions: true,
  normals: true,
  colors: true,
  uvs: true,
}

export class CustomGeometry {
  public positions?: FastArray<number>
  public normals?: FastArray<number>
  public colors?: FastArray<number>
  public uvs?: FastArray<number>

  constructor(vertexCount: number, options: CustomGeometryOptions) {
    options = { ...defaultGeometryOptions, ...options }

    if (options.positions) this.positions = new FastArray(vertexCount * 3)
    if (options.normals) this.normals = new FastArray(vertexCount * 3)
    if (options.colors) this.colors = new FastArray(vertexCount * 3)
    if (options.uvs) this.uvs = new FastArray(vertexCount * 2)
  }

  public generateBufferGeometry() {
    const geometry = new THREE.BufferGeometry()

    if (this.positions) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.positions.shorten()), 3)
      geometry.setAttribute('position', attribute)
    }
    if (this.normals) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.normals.shorten()), 3)
      geometry.setAttribute('normal', attribute)
    }
    if (this.colors) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.colors.shorten()), 3)
      geometry.setAttribute('color', attribute)
    }
    if (this.uvs) {
      const attribute = new THREE.BufferAttribute(new Float32Array(this.uvs.shorten()), 2)
      geometry.setAttribute('uv', attribute)
    }

    return geometry
  }
}
