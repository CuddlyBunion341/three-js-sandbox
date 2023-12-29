// import THREE, { BufferGeometry, MeshBasicMaterial } from "three"
import * as THREE from 'three'
import { GeometryBuilder } from "./GeometryBuilder"
import { ChunkData } from './ChunkData'
import { BlockTypes, blocks } from './Blocks'
import { opaqueMaterial, transparentMaterial } from './Assets'
import { ChunkGeometry } from './ChunkGeometry'

export class ChunkMesher extends ChunkData {
    public x: number
    public z: number

    private _meshes!: THREE.Mesh[]

    constructor(x: number, z: number) {
        super()
        this.x = x
        this.z = z
    }

    public get meshes() {
        if (this._meshes) return this._meshes

        this._meshes = this.generateMeshes()
        return this._meshes
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
        const block = this.getNeighborBlock(x, y, z)
        return block !== BlockTypes.AIR && block !== undefined
    }

    private showFace(blockId: number, x: number, y: number, z: number) {
        const otherBlockId = this.getNeighborBlock(x, y, z)
        return !otherBlockId || (!blocks[otherBlockId].opaque && blockId !== otherBlockId)
    }

    private generateMeshes() {
        // 6 faces * 2 triangles per face * 3 vertices per triangle
        const maxVertexCount = 6 * 2 * 3 * ChunkData.WIDTH * ChunkData.HEIGHT * ChunkData.DEPTH

        const geometryObjects = new Map<string, ChunkGeometry>()
        geometryObjects.set('solid', new ChunkGeometry(maxVertexCount))

        const geometryBuilder = new GeometryBuilder()

        for (let x = 0; x < ChunkData.WIDTH; x++) {
            for (let z = 0; z < ChunkData.DEPTH; z++) {
                for (let y = 0; y < ChunkData.HEIGHT; y++) {
                    const blockId = this.getUnsafeBlock(x, y, z)
                    if (!blockId) continue

                    const block = blocks[blockId]
                    const blockTextures = block.textures

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

                            const geometryKey = (() => {
                                if (block.opaque) return 'solid'
                                return block.name;
                            })()

                            const geometryObject: ChunkGeometry = (() => {
                                if (geometryObjects.get(geometryKey)) {
                                    return geometryObjects.get(geometryKey)!
                                }

                                const object = new ChunkGeometry(maxVertexCount)
                                geometryObjects.set(geometryKey, object)
                                return object
                            })()


                            const u = uvs[i * 2 + 0]
                            const v = uvs[i * 2 + 1]

                            const mappedUvs: number[] = [
                                (u === 0 ? textureData.u[0] : textureData.u[1]),
                                (v === 0 ? textureData.v[0] : textureData.v[1])
                            ]

                            const colors = [ambientOcclusion, ambientOcclusion, ambientOcclusion]

                            geometryObject.streamVertexData({
                                positions: positions.slice(i * 3, (i + 1) * 3),
                                normals: normals.slice(i * 3, (i + 1) * 3),
                                uvs: mappedUvs,
                                colors,
                            })
                        }
                    }
                }
            }
        }

        const meshes: THREE.Mesh[] = []

        geometryObjects.forEach((geometryObject, key) => {
            const geometry = geometryObject.bufferGeometry

            const material = (() => {
                if (key === 'solid') return opaqueMaterial
                return transparentMaterial
            })()

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(this.x * ChunkData.WIDTH, 0, this.z * ChunkData.DEPTH)

            meshes.push(mesh)
        })

        return meshes
    }
}
