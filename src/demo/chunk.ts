// import THREE, { BufferGeometry, MeshBasicMaterial } from "three"
import * as THREE from 'three'
import { GeometryBuilder } from "./mesh_generator"

export class Chunk {
    public static WIDTH = 3
    public static HEIGHT = 3
    public static DEPTH = 3

    public blocks: Uint8Array

    public x: number
    public z: number

    private _mesh!: THREE.Mesh

    constructor(x: number, z: number) {
        this.x = x
        this.z = z
        this.blocks = new Uint8Array(Chunk.WIDTH * Chunk.HEIGHT * Chunk.DEPTH)
        for (let i = 0; i < Chunk.WIDTH * Chunk.HEIGHT * Chunk.DEPTH; i++) {
            this.blocks[i] = 1
        }
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

    public getBlock(x: number, y: number, z: number) {
        const index = this.getBlockIndex(x, y, z)
        return this.blocks[index]
    }

    public setBlock(x: number, y: number, z: number, block: number) {
        const index = this.getBlock(x, y, z)
        this.blocks[index] = block
    }

    public getBlockIndex(x: number, y: number, z: number) {
        if (x < 0 || x > Chunk.WIDTH || y < 0 || y > Chunk.HEIGHT || z < 0 || z > Chunk.DEPTH) return 0
        return this.getUnsafeBlockIndex(x, y, z)
    }

    public getUnsafeBlockIndex(x: number, y: number, z: number) {
        return x + Chunk.WIDTH * (y + Chunk.DEPTH * z)
    }

    private generateMesh() {
        const geometry = new THREE.BufferGeometry()
        const texture = new THREE.TextureLoader().load('assets/textures/cobblestone.png')
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearFilter
        texture.colorSpace = THREE.DisplayP3ColorSpace
        const material = new THREE.MeshBasicMaterial({ wireframe: false, map: texture })

        const allIndices: number[] = []
        const allPositions: number[] = []

        const geometryBuilder = new GeometryBuilder()

        for (let x = 0; x < Chunk.WIDTH; x++) {
            for (let y = 0; y < Chunk.HEIGHT; y++) {
                for (let z = 0; z < Chunk.DEPTH; z++) {
                    if (!this.blocks[this.getUnsafeBlockIndex(x, y, z)]) continue

                    const vx = x + this.x * Chunk.WIDTH
                    const vy = y
                    const vz = z + this.z * Chunk.DEPTH

                    const faceMask = [
                        !this.getBlock(x - 1, y, z),
                        !this.getBlock(x + 1, y, z),
                        !this.getBlock(x, y, z - 1),
                        !this.getBlock(x, y, z + 1),
                        !this.getBlock(x, y + 1, z),
                        !this.getBlock(x, y - 1, z),
                    ]
                    const { positions, indices } = geometryBuilder.getGeometry(vx, vy, vz, faceMask)

                    allIndices.push(...indices)
                    allPositions.push(...positions)
                }
            }
        }

        const positionsBuffer = new THREE.BufferAttribute(new Float32Array(allPositions), 3)

        geometry.setAttribute('position', positionsBuffer)
        geometry.setIndex(allIndices)

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
        return mesh
    }
}
