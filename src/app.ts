import { createCubeScene } from './scene/cubeScene.ts'
import { createFaceTracker } from './tracking/faceTracker.ts'

export type AppHandle = {
  dispose: () => void
}

export async function startApp(): Promise<AppHandle> {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) throw new Error('#app element not found.')

  app.innerHTML = `
    <div class="stage">
      <canvas id="sceneCanvas" aria-label="Face controlled cube"></canvas>
      <video id="cameraFeed" playsinline muted></video>
      <p id="statusText" class="status">Initializing camera...</p>
    </div>
  `

  const canvas = document.querySelector<HTMLCanvasElement>('#sceneCanvas')
  const video = document.querySelector<HTMLVideoElement>('#cameraFeed')
  const statusText = document.querySelector<HTMLParagraphElement>('#statusText')
  if (!canvas || !video || !statusText) {
    throw new Error('App bootstrap elements are missing.')
  }

  const cubeScene = createCubeScene(canvas)
  let animationFrameId: number | null = null

  try {
    const tracker = await createFaceTracker(video)
    statusText.textContent = 'Face tracking active'

    const animate = () => {
      const result = tracker.getLatestFaceCenter()
      cubeScene.update(result?.x)
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return {
      dispose: () => {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
        tracker.dispose()
        cubeScene.dispose()
      },
    }
  } catch (error) {
    console.error(error)
    statusText.textContent = 'Camera permission required to start face tracking'
    return {
      dispose: () => {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
        cubeScene.dispose()
      },
    }
  }
}
