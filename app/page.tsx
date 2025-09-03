import { FlowCanvas } from '@/components/flow/FlowCanvas'

export default function Home() {
  return (
    <main className="w-full h-screen" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <FlowCanvas />
    </main>
  )
}