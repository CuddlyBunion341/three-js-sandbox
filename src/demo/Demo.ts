import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Voxel } from "./Voxel";
import { Experience } from "../engine/Experience";
import { Resource } from "../engine/Resources";

export class Demo implements Experience {
  resources: Resource[] = [];

  constructor(private engine: Engine) {}

  init() {
    const voxel = new Voxel();
    voxel.position.set(0, 1, 0);

    this.engine.scene.add(voxel);
  }

  resize() {}

  update() {}
}
