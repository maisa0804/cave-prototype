import * as THREE from 'three'

type CubeScene = {
  update: (faceX?: number) => void
  dispose: () => void
}

export function createCubeScene(canvas: HTMLCanvasElement): CubeScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 4)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1)
  keyLight.position.set(2, 4, 3)
  scene.add(ambientLight, keyLight)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x66aaff, roughness: 0.3, metalness: 0.4 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  let smoothedFaceX = 3
  let direction = 1

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  return {
    update(faceX?: number) {
      if (typeof faceX === 'number') {
        smoothedFaceX = smoothedFaceX * 0.85 + faceX * 0.15
        direction = smoothedFaceX < 0.5 ? -1 : 1
      }

      const offset = smoothedFaceX - 0.5
      cube.rotation.y += 0.02 * direction
      cube.rotation.x = offset * 0.8
      cube.rotation.z = -offset * 0.6
      cube.position.x = offset * 1.8

      renderer.render(scene, camera)
    },
    dispose() {
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
