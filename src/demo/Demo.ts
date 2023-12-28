import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { World } from "./World";

export class Demo implements Experience {
  resources: Resource[] = [];

  constructor(private engine: Engine) { }

  init() {
    const world = new World(69420)

    const renderDistance = 5
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
          world.getChunk(x - 1, z)!,
          world.getChunk(x, z - 1)!,
          world.getChunk(x, z + 1)!,
        ]
        this.engine.scene.add(chunk.mesh)

        const boundingBoxHelper = new THREE.BoxHelper(chunk.mesh)
        this.engine.scene.add(boundingBoxHelper)
      }
    }

    const axesHelper = new THREE.AxesHelper(2);
    this.engine.scene.add(axesHelper)
  }

  resize() { }

  update() { }
}
