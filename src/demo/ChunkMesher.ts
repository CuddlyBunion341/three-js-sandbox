// import THREE, { BufferGeometry, MeshBasicMaterial } from "three"
import * as THREE from 'three'
import { GeometryBuilder } from "./GeometryBuilder"
import { ChunkData } from './ChunkData'
import { BlockTypes, blocks } from './Blocks'
import { material as material } from './Assets'

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

    private vertexAO(x: number, y: number, z: number) {
        // Implemented with assistance of the GPT4 chatbot
        let occlusion = 0;
        const maxOcclusion = 8; // The maximum number of neighbors for a corner vertex.

        // Check each of the three voxels touching the corner
        if (this.isSolid(x, y + 1, z)) occlusion++;
        if (this.isSolid(x + 1, y, z)) occlusion++;
        if (this.isSolid(x, y, z + 1)) occlusion++;

        // Check three voxels diagonal to the corner
        if (this.isSolid(x + 1, y + 1, z) && (this.isSolid(x, y + 1, z) || this.isSolid(x + 1, y, z))) occlusion++;
        if (this.isSolid(x, y + 1, z + 1) && (this.isSolid(x, y + 1, z) || this.isSolid(x, y, z + 1))) occlusion++;
        if (this.isSolid(x + 1, y, z + 1) && (this.isSolid(x + 1, y, z) || this.isSolid(x, y, z + 1))) occlusion++;
        if (this.isSolid(x + 1, y + 1, z + 1) && (this.isSolid(x, y + 1, z + 1) || this.isSolid(x + 1, y, z + 1) || this.isSolid(x + 1, y + 1, z))) occlusion++;

        // Normalize the occlusion value
        const aoValue = (maxOcclusion - occlusion) / maxOcclusion;
        return aoValue;
    }

    private isSolid(x: number, y: number, z: number) {
        const block = this.getBlock(x, y, z)
        return block !== BlockTypes.AIR && block !== undefined
    }

    private showFace(blockId: number, x: number, y: number, z: number) {
        const otherBlockId = this.getNeighborBlock(x, y, z)
        return !otherBlockId || (!blocks[otherBlockId].opaque && blockId !== otherBlockId)
    }

    private generateMesh() {
        const geometry = new THREE.BufferGeometry()

        // const material = new THREE.MeshMatcapMaterial({ vertexColors: true })

        // 6 faces * 2 triangles per face * 3 vertices per triangle
        const maxVertexCount = 6 * 2 * 3 * ChunkData.WIDTH * ChunkData.HEIGHT * ChunkData.DEPTH

        const allPositions: number[] = Array(maxVertexCount * 3)
        const allNormals: number[] = Array(maxVertexCount * 3)
        const allColors: number[] = Array(maxVertexCount * 3)
        const allUvs: number[] = Array(maxVertexCount * 2)

        let lastIndex = 0

        const geometryBuilder = new GeometryBuilder()

        for (let x = 0; x < ChunkData.WIDTH; x++) {
            for (let z = 0; z < ChunkData.DEPTH; z++) {
                for (let y = 0; y < ChunkData.HEIGHT; y++) {
                    const blockId = this.getUnsafeBlock(x, y, z)
                    if (!blockId) continue

                    const blockTextures = blocks[blockId].textures

                    const faceMask = [
                        this.showFace(blockId, x - 1, y, z),
                        this.showFace(blockId, x + 1, y, z),
                        this.showFace(blockId, x, y, z - 1),
                        this.showFace(blockId, x, y, z + 1),
                        this.showFace(blockId, x, y - 1, z),
                        this.showFace(blockId, x, y + 1, z),
                    ]

                    const faceCount = 6
                    const vertexCount = 6

                    for (let faceIndex = 0; faceIndex < faceCount; faceIndex++) {
                        if (!faceMask[faceIndex]) continue

                        const textureData = blockTextures[faceIndex]
                        if (!textureData) throw new Error(`Texture[${faceIndex}] not present on block ${blockId}`)

                        const { positions, uvs, normals } = geometryBuilder.getFace(x, y, z, faceIndex)

                        for (let i = 0; i < vertexCount; i++) {
                            const ambientOcclusion = Math.min(this.vertexAO(
                                Math.floor(positions[i * 3 + 0]),
                                Math.floor(positions[i * 3 + 1]),
                                Math.floor(positions[i * 3 + 2])), 0.5)

                            for (let j = 0; j < 3; j++) {
                                allPositions[(lastIndex + i) * 3 + j] = positions[i * 3 + j]
                                allNormals[(lastIndex + i) * 3 + j] = normals[i * 3 + j]
                                allColors[(lastIndex + i) * 3 + j] = ambientOcclusion
                            }

                            const u = uvs[i * 2 + 0]
                            const v = uvs[i * 2 + 1]

                            // TODO: refactor
                            allUvs[(lastIndex + i) * 2 + 0] = (u === 0 ? textureData.u[0] : textureData.u[1])
                            allUvs[(lastIndex + i) * 2 + 1] = (v === 0 ? textureData.v[0] : textureData.v[1])
                        }
                        lastIndex += vertexCount
                    }
                }
            }
        }

        const slicedPositions = allPositions.slice(0, lastIndex * 3)
        const slicedNormals = allNormals.slice(0, lastIndex * 3)
        const slicedColors = allColors.slice(0, lastIndex * 3)
        const slicedUvs = allUvs.slice(0, lastIndex * 2)

        const positionsBuffer = new THREE.BufferAttribute(new Float32Array(slicedPositions), 3)
        const normalsBuffer = new THREE.BufferAttribute(new Float32Array(slicedNormals), 3)
        const colorsBuffer = new THREE.BufferAttribute(new Float32Array(slicedColors), 3)
        const uvsBuffer = new THREE.BufferAttribute(new Float32Array(slicedUvs), 2)

        geometry.setAttribute('position', positionsBuffer)
        geometry.setAttribute('normal', normalsBuffer)
        geometry.setAttribute('color', colorsBuffer)
        geometry.setAttribute('uv', uvsBuffer)

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(this.x * ChunkData.WIDTH, 0, this.z * ChunkData.DEPTH)

        return mesh
    }
}
