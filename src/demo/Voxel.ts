import * as THREE from "three";

export class Voxel extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array([
      -0.5, -0.5, -0.5,    // A 0
      0.5, -0.5, -0.5,    // B 1
      0.5,  0.5, -0.5,    // C 2
      -0.5,  0.5, -0.5,    // D 3
      -0.5, -0.5,  0.5,    // E 4
      0.5, -0.5,  0.5,     // F 5
      0.5,  0.5,  0.5,     // G 6
      -0.5,  0.5,  0.5,     // H 7

      -0.5,  0.5, -0.5,    // D 8
      -0.5, -0.5, -0.5,    // A 9
      -0.5, -0.5,  0.5,    // E 10
      -0.5,  0.5,  0.5,    // H 11
      0.5, -0.5, -0.5,     // B 12
      0.5,  0.5, -0.5,     // C 13
      0.5,  0.5,  0.5,     // G 14
      0.5, -0.5,  0.5,     // F 15

      -0.5, -0.5, -0.5,    // A 16
      0.5, -0.5, -0.5,     // B 17
      0.5, -0.5,  0.5,     // F 18
      -0.5, -0.5,  0.5,    // E 19
      0.5,  0.5, -0.5,     // C 20
      -0.5,  0.5, -0.5,    // D 21
      -0.5,  0.5,  0.5,    // H 22
      0.5,  0.5,  0.5,     // G 23
    ]);

    // index data
     const indices = [
      // front and back
      0, 3, 2,
      2, 1, 0,
      4, 5, 6,
      6, 7 ,4,
      // left and right
      11, 8, 9,
      9, 10, 11,
      12, 13, 14,
      14, 15, 12,
      // bottom and top
      16, 17, 18,
      18, 19, 16,
      20, 21, 22,
      22, 23, 20
    ];
    geometry.setIndex( indices );
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

    super(geometry, material);
  }
}
