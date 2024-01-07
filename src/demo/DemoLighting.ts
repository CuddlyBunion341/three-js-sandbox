import * as THREE from "three"
import { Demo } from "./Demo"
import CSM from "three-csm"
import { opaqueMaterial, transparentMaterial, waterMaterial } from "./Assets"

export class DemoLighting {
  public sunLightGroup: THREE.Group
  public ambientLight: THREE.AmbientLight
  public hemisphereLight: THREE.HemisphereLight
  public pointLight: THREE.PointLight
  public csm: CSM

  constructor(private demo: Demo) {
    this.ambientLight = this.addAmbientLight()
    this.hemisphereLight = this.addHemisphereLight()
    this.sunLightGroup = this.addSunLight()
    this.pointLight = this.addPointLight()

    this.csm = this.configureCSM()
  }

  private configureCSM() {
    const csm = new CSM({
      maxFar: 1000,
      cascades: 3,
      mode: "practical",
      lightDirection: new THREE.Vector3(1, -1, 1),
      lightIntensity: 5,
      camera: this.demo.engine.camera.instance,
      parent: this.demo.engine.scene,
    })
    csm.noLastCascadeCutOff = true

    csm.setupMaterial(transparentMaterial)
    csm.setupMaterial(opaqueMaterial)
    // csm.setupMaterial(waterMaterial)

    const helper = new CSM.Helper(csm)
    this.demo.engine.scene.add(helper)

    const folder = this.demo.engine.debug.gui.addFolder('CSM')
    folder.add(csm, 'cascades', 1, 4, 1).name('Cascade Count').onChange(() => {
      csm.updateCascades(csm.cascades)
    })
    folder.add(csm, 'maxFar', 0, 1000, 1).name('Max Far').onChange(() => {
      csm.updateFrustums()
    })
    folder.add(csm, 'lightIntensity', 0, 10, 0.01).name('Light Intensity').onChange(() => {
    })
    folder.addColor({ color: csm.lightColor }, 'color').name('Light Color').onChange(() => {
         })
    folder.add(csm.lightDirection, 'x', -1, 1, 0.01).name('Light X').onChange(() => {
         })
    folder.add(csm.lightDirection, 'y', -1, 1, 0.01).name('Light Y').onChange(() => {
         })
    folder.add(csm.lightDirection, 'z', -1, 1, 0.01).name('Light Z').onChange(() => {
         })
    folder.add(csm, 'shadowBias', 0, 1, 0.0001).name('Shadow Bias').onChange(() => {
         })
    folder.add(csm, 'shadowNormalBias', 0, 1, 0.0001).name('Shadow Normal Bias').onChange(() => {
         })
    folder.add(csm, 'shadowMapSize', 0, 4096, 1).name('Shadow Map Size').onChange(() => {
      csm.updateShadowMapSize(csm.shadowMapSize)
    })
    folder.add(csm, 'fade').name('Fade').onChange(() => {
         })

    transparentMaterial.needsUpdate = true
    opaqueMaterial.needsUpdate = true

    return csm
  }

  public update() {
    this.csm.update()
  }


  private addAmbientLight() {
    const folder = this.demo.engine.debug.gui.addFolder('Ambient Light')
    const ambientLight = new THREE.AmbientLight(0xffffff, 0)
    this.demo.engine.scene.add(ambientLight)
    this.demo.engine.scene.add(ambientLight)

    folder.add(ambientLight, 'intensity', 0, 10, 0.01)

    return ambientLight
  }

  private addHemisphereLight() {
    const folder = this.demo.engine.debug.gui.addFolder('Hemisphere Light')
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.position.set(0, 50, 0)
    this.demo.engine.scene.add(hemiLight)

    folder.add(hemiLight, 'intensity', 0, 10, 0.01)

    return hemiLight
  }

  private addSunLight() {
    const folder = this.demo.engine.debug.gui.addFolder('Sun Light')
    const sunLight = new THREE.DirectionalLight(0xffffff, 6)
    sunLight.castShadow = true
    const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 1)

    sunLight.position.set(0, 80, 0)
    sunLight.target.position.set(40, 0, 40)
    sunLight.shadow.camera.left = -10
    sunLight.shadow.camera.right = 100
    sunLight.shadow.camera.top = 20
    sunLight.shadow.camera.bottom = -20
    sunLight.shadow.camera.near = 0.01
    sunLight.shadow.camera.far = 50

    const sunLightGroup = new THREE.Group()

    folder.add(sunLight, 'intensity', 0, 10, 0.01)
    folder.add(sunLightGroup.position, 'x', 0, 64, 0.01)
    folder.add(sunLightGroup.position, 'y', 0, 64, 0.01)
    folder.add(sunLightGroup.position, 'z', 0, 64, 0.01)
    folder.add(sunLight.target.position, 'x', 0, 64, 0.01).name('Target X')
    folder.add(sunLight.target.position, 'y', 0, 64, 0.01).name('Target Y')
    folder.add(sunLight.target.position, 'z', 0, 64, 0.01).name('Target Z')

    const shadowHelper = new THREE.CameraHelper(sunLight.shadow.camera)
    folder.add(shadowHelper, 'visible').name('Enable Shadow Helper')

    sunLightGroup.add(sunLight)
    sunLightGroup.add(sunLight.target)
    sunLightGroup.add(sunLightHelper)
    sunLightGroup.add(shadowHelper)
    this.demo.engine.scene.add(sunLightGroup)
    
    return sunLightGroup
  }

  private addPointLight() {
    const folder = this.demo.engine.debug.gui.addFolder('Point Light')
    const light = new THREE.PointLight(0xFF0000, 20, 100)
    light.position.set(10.5, 37, 11)
    light.castShadow = true
    this.demo.engine.scene.add(light)

    const helper = new THREE.PointLightHelper(light, 1)
    this.demo.engine.scene.add(helper)

    folder.add(light, 'intensity', 0, 100, 0.01)
    folder.addColor({ color: light.color }, 'color').name('Color').onChange(() => {
      light.color.set(light.color)
    })
    folder.add(light.position, 'x', 0, 64, 0.1)
    folder.add(light.position, 'y', 0, 64, 0.1)
    folder.add(light.position, 'z', 0, 64, 0.1)

    return light
  }
}
