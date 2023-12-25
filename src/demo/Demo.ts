import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { Chunk } from "./Chunk";

export class Demo implements Experience {
  resources: Resource[] = [];

  constructor(private engine: Engine) { }

  init() {
    for (let x = 0; x < 10; x++) {
      for (let z = 0; z < 10; z++) {
        setTimeout(() => {
          this.addChunk(x, z)
        }, 0)
      }
    }

    const axesHelper = new THREE.AxesHelper(2);
    this.engine.scene.add(axesHelper)
  }

  private addChunk(x: number, z: number) {
    const chunk = new Chunk(x, z)
    chunk.generateTerrain
    this.engine.scene.add(chunk.mesh)
  }

  resize() { }

  update() { }
}
