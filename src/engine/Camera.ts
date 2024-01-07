import { Engine } from './Engine'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GameEntity } from './GameEntity'

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  private controls!: PointerLockControls

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.instance.position.z = -15
    this.instance.position.x = -15
    this.instance.position.y = 60
    this.engine.scene.add(this.instance)
  }

  private initControls() {
    // this.controls = new OrbitControls(this.instance, this.engine.canvas)
    this.controls = new PointerLockControls(this.instance, document.body)
    // this.controls.update()
    this.controls.connect()

    this.engine.canvas.addEventListener('click', () => {
      this.controls.lock()
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'w') {
        this.controls.moveForward(1)
      } else if (event.key === 's') {
        this.controls.moveForward(-1)
      } else if (event.key === 'a') {
        this.controls.moveRight(-1)
      } else if (event.key === 'd') {
        this.controls.moveRight(1)
      } else if (event.key === ' ') {
        this.instance.position.y += 1
      } else if (event.key === 'x') {
        this.instance.position.y -= 1
      }
    })
  }

  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  update() {
    // this.controls.update()
  }
}
