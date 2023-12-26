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

    const renderDistance = 1
    for (let x = 0; x < renderDistance; x++) {
      for (let z = 0; z < renderDistance; z++) {
        const chunk = world.generateChunk(x, z)
        if (!chunk) throw Error(`Chunk ${x}x${z} could not be created!`)
        this.engine.scene.add(chunk.mesh)
      }
    }

    const axesHelper = new THREE.AxesHelper(2);
    this.engine.scene.add(axesHelper)
  }

  resize() { }

  update() { }
}
