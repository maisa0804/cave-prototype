import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

type FaceCenter = { x: number; y: number }

type FaceTracker = {
  getLatestFaceCenter: () => FaceCenter | null
  dispose: () => void
}

const VISION_WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const FACE_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

export async function createFaceTracker(video: HTMLVideoElement): Promise<FaceTracker> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: 640, height: 480 },
    audio: false,
  })

  video.srcObject = stream
  await video.play()

  const vision = await FilesetResolver.forVisionTasks(VISION_WASM_URL)
  const landmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: FACE_LANDMARKER_MODEL_URL },
    runningMode: 'VIDEO',
    numFaces: 1,
  })

  let latest: FaceCenter | null = null
  let rafId: number | null = null
  let disposed = false

  const detect = () => {
    if (disposed) return
    const result = landmarker.detectForVideo(video, performance.now())
    const firstFace = result.faceLandmarks[0]
    if (firstFace) {
      // Landmark 1 is near the nose bridge, stable enough for center tracking.
      const anchor = firstFace[1]
      latest = { x: anchor.x, y: anchor.y }
    } else {
      latest = null
    }
    rafId = requestAnimationFrame(detect)
  }
  detect()

  return {
    getLatestFaceCenter: () => latest,
    dispose: () => {
      disposed = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      landmarker.close()
      const tracks = stream.getTracks()
      for (const track of tracks) track.stop()
      video.srcObject = null
    },
  }
}
