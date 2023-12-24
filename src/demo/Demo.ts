import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";
import { Chunk } from "./chunk";

export class Demo implements Experience {
  resources: Resource[] = [];

  constructor(private engine: Engine) { }

  init() {
    const chunk = new Chunk(0, 0)
    chunk.generateTerrain()
    this.engine.scene.add(chunk.mesh)

    const axesHelper = new THREE.AxesHelper(2);
    this.engine.scene.add(axesHelper)
  }

  resize() { }

  update() { }
}
