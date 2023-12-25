// import THREE, { BufferGeometry, MeshBasicMaterial } from "three"
import * as THREE from 'three'
import { GeometryBuilder } from "./GeometryBuilder"
import { ChunkData } from './ChunkData'

export class ChunkMesher extends ChunkData {
    public x: number
    public z: number

    private _mesh!: THREE.Mesh

    constructor(x: number, z: number) {
        super()
        this.x = x
        this.z = z
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
        const maxVertexCount = 6 * 2 * 3 * ChunkData.WIDTH * ChunkData.HEIGHT * ChunkData.DEPTH

        const allUvs: number[] = Array(maxVertexCount * 2)
        const allNormals: number[] = Array(maxVertexCount * 3)
        const allPositions: number[] = Array(maxVertexCount * 3)

        let lastIndex = 0

        const geometryBuilder = new GeometryBuilder()

        for (let x = 0; x < ChunkData.WIDTH; x++) {
            for (let y = 0; y < ChunkData.HEIGHT; y++) {
                for (let z = 0; z < ChunkData.DEPTH; z++) {
                    if (!this.getUnsafeBlock(x, y, z)) continue

                    const faceMask = [
                        !this.getBlock(x - 1, y, z),
                        !this.getBlock(x + 1, y, z),
                        !this.getBlock(x, y, z - 1),
                        !this.getBlock(x, y, z + 1),
                        !this.getBlock(x, y - 1, z),
                        !this.getBlock(x, y + 1, z),
                    ]

                    const { positions, uvs, normals, indices } = geometryBuilder.getGeometry(x, y, z, faceMask)
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

        const slicedPositions = allPositions.slice(0, lastIndex * 3)
        const slicedNormals = allNormals.slice(0, lastIndex * 3)
        const slicedUvs = allUvs.slice(0, lastIndex * 2)

        const positionsBuffer = new THREE.BufferAttribute(new Float32Array(slicedPositions), 3)
        const uvsBuffer = new THREE.BufferAttribute(new Float32Array(slicedUvs), 2)
        const normalsBuffer = new THREE.BufferAttribute(new Float32Array(slicedNormals), 3)

        geometry.setAttribute('position', positionsBuffer)
        geometry.setAttribute('uv', uvsBuffer)
        geometry.setAttribute('normal', normalsBuffer)

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(this.x * 16, 0, this.z * 16)

        return mesh
    }
}
