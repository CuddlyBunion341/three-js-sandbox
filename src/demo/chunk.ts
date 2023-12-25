// import THREE, { BufferGeometry, MeshBasicMaterial } from "three"
import * as THREE from 'three'
import { GeometryBuilder } from "./mesh_generator"
import { ChunkData } from './ChunkData'

export class Chunk extends ChunkData {
    public x: number
    public z: number

    private _mesh!: THREE.Mesh

    constructor(x: number, z: number) {
        super()
        this.x = x
        this.z = z
    }

    public generateTerrain() {
        // for (let x = 0; x < Chunk.WIDTH; x++) {
        //     for (let y = 0; y < Math.random() * 50; y++) {
        //         for (let z = 0; z < Chunk.DEPTH; z++) {
        //             const index = this.getUnsafeBlockIndex(x, y, z)
        //             this.blocks[index] = 1
        //         }
        //     }
        // }
    }

    public get mesh() {
        if (this._mesh) return this._mesh

        this._mesh = this.generateMesh()
        return this._mesh
    }

    private generateMesh() {
        const geometry = new THREE.BufferGeometry()
        const texture = new THREE.TextureLoader().load('assets/textures/cobblestone.png')
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        texture.colorSpace = THREE.DisplayP3ColorSpace
        const material = new THREE.MeshBasicMaterial({ wireframe: false, map: texture })

        // 6 faces * 2 triangles per face * 3 vertices per triangle
        const vertexCount = 6 * 2 * 3 * Chunk.WIDTH * Chunk.HEIGHT * Chunk.DEPTH

        const allUvs: number[] = Array(vertexCount * 2)
        const allNormals: number[] = Array(vertexCount * 3)
        const allPositions: number[] = Array(vertexCount * 3)

        let lastIndex = 0

        const geometryBuilder = new GeometryBuilder()

        for (let x = 0; x < Chunk.WIDTH; x++) {
            for (let y = 0; y < Chunk.HEIGHT; y++) {
                for (let z = 0; z < Chunk.DEPTH; z++) {
                    if (!this.getUnsafeBlock(x, y, z)) continue

                    const faceMask = [
                        !this.getBlock(x - 1, y, z),
                        !this.getBlock(x + 1, y, z),
                        !this.getBlock(x, y, z - 1),
                        !this.getBlock(x, y, z + 1),
                        !this.getBlock(x, y - 1, z),
                        !this.getBlock(x, y + 1, z),
                    ]

                    const vx = x + this.x * Chunk.WIDTH
                    const vy = y
                    const vz = z + this.z * Chunk.DEPTH

                    const { positions, uvs, normals, indices } = geometryBuilder.getGeometry(vx, vy, vz, faceMask)
                    for (let i = 0; i < indices.length; i++) {
                        for (let j = 0; j < 3; j++) {
                            allPositions[(lastIndex + i) * 3 + j] = positions[i * 3 + j]
                            allNormals[(lastIndex + i) * 3 + j] = normals[i * 3 + j]
                        }

                        for (let j = 0; j < 2; j++) {
                            allUvs[(lastIndex + i) * 2 + j] = uvs[i * 2 + j]
                        }
                    }
                    lastIndex += indices.length
                }
            }
        }

        const positionsBuffer = new THREE.BufferAttribute(new Float32Array(allPositions), 3)
        const uvsBuffer = new THREE.BufferAttribute(new Float32Array(allUvs), 2)
        const normalsBuffer = new THREE.BufferAttribute(new Float32Array(allNormals), 3)

        geometry.setAttribute('position', positionsBuffer)
        geometry.setAttribute('uv', uvsBuffer)
        geometry.setAttribute('normal', normalsBuffer)

        // TODO: set geometry index

        return new THREE.Mesh(geometry, material)
    }
}
