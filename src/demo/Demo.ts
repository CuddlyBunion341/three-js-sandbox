import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { World } from "./World";
import { opaqueMaterial, transparentMaterial } from "./Assets";
import { DemoLighting } from "./DemoLighting";

export class Demo implements Experience {
  resources: Resource[] = [];

  private demoLighting!: DemoLighting

  constructor(public engine: Engine) {
  }

  private addMaterialsGUI() {
    this.engine.debug.gui.add(opaqueMaterial, 'wireframe').name('Opaque Material Wireframe')
    this.engine.debug.gui.add(opaqueMaterial, 'vertexColors').name('Ambient Occlusion').onChange(() => {
      opaqueMaterial.needsUpdate = true
    })
    this.engine.debug.gui.add(transparentMaterial, 'alphaTest', 0, 1, 0.01).name('Alpha Test').onChange(() => {
      transparentMaterial.needsUpdate = true
    })
  }

  private setBackground() {
    this.engine.scene.background = new THREE.Color(0x87ceeb)
    this.engine.scene.fog = new THREE.FogExp2(0x87ceeb, 0.02)
    const folder = this.engine.debug.gui.addFolder('Fog')
    folder.addColor({ color: this.engine.scene.fog.color }, 'color').name('Color')
    folder.add(this.engine.scene.fog, 'density', 0, 0.1, 0.001).name('Density')
  }

  init() {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
    this.engine.scene.add(cube)
    cube.position.set(32, 64, 32)

    this.addMaterialsGUI()
    this.setBackground()
    this.addMiscHelpers()

    this.demoLighting = new DemoLighting(this)

    this.createWorld()
  }

  private addMiscHelpers() {
    const axesHelper = new THREE.AxesHelper(2);
    this.engine.scene.add(axesHelper)
    const gridHelper = new THREE.GridHelper(128, 128)
    this.engine.scene.add(gridHelper)
  }

  private createWorld() {
    const world = new World(69420)

    const renderDistance = 2
    for (let x = -1; x < renderDistance + 1; x++) {
      for (let z = -1; z < renderDistance + 1; z++) {
        const chunk = world.generateChunk(x, z)
        if (!chunk) throw Error(`Chunk ${x}x${z} could not be created!`)
      }
    }

    for (let x = 0; x < renderDistance; x++) {
      for (let z = 0; z < renderDistance; z++) {
        const chunk = world.getChunk(x, z)
        if (!chunk) throw new Error(`Chunk ${x}x${z} is not pregenerated!`)
        chunk.neighbors = [
          world.getChunk(x - 1, z)!,
          world.getChunk(x + 1, z)!,
          world.getChunk(x, z - 1)!,
          world.getChunk(x, z + 1)!,
        ]
        chunk.meshes.forEach((mesh) => {
          this.engine.scene.add(mesh)
          // const boundingBoxHelper = new THREE.BoxHelper(mesh)
          // this.engine.scene.add(boundingBoxHelper)
        })
      }
    }
  }

  resize() { }

  update() {
    this.demoLighting.update()
  }
}
