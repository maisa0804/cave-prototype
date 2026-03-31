import './style.css'
import { startApp } from './app.ts'

type AppHandle = { dispose: () => void }

let appHandle: AppHandle | null = null

const mount = async () => {
  appHandle?.dispose()
  appHandle = await startApp()
}

void mount()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    appHandle?.dispose()
    appHandle = null
  })
}
