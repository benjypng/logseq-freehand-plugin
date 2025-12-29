import { useRef, useState } from 'react'

import { Point } from '../interfaces'
import { useSyncLogseq } from './hooks/use-sync-logseq'
import { SketchCanvas } from './SketchCanvas'
import { SketchToolbar } from './SketchToolbar'

export const SketchContainer = ({
  sketchContainerUuid,
}: {
  sketchContainerUuid: string
}) => {
  const { strokes, setStrokes, saveStrokes, clearStrokes } =
    useSyncLogseq(sketchContainerUuid)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])

  const [color, setColor] = useState('#000000')
  const [size] = useState(6)

  const isDrawingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getPointFromEvent = (e: React.PointerEvent): Point => {
    const rect = containerRef.current!.getBoundingClientRect()
    return [e.clientX - rect.left, e.clientY - rect.top]
  }

  const stopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    stopEvent(e)
    containerRef.current?.setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    setCurrentPoints([getPointFromEvent(e)])
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return
    stopEvent(e)
    setCurrentPoints((prev) => [...prev, getPointFromEvent(e)])
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    stopEvent(e)

    if (!isDrawingRef.current) return

    isDrawingRef.current = false
    const nextStrokes = [...strokes, { points: currentPoints, color, size }]

    setStrokes(nextStrokes)
    setCurrentPoints([])
    saveStrokes(nextStrokes)

    containerRef.current?.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      ref={containerRef}
      className="freehand-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={stopEvent}
      onMouseDown={stopEvent}
    >
      <SketchToolbar
        color={color}
        onColorChange={setColor}
        onClear={clearStrokes}
      />
      <SketchCanvas
        strokes={strokes}
        currentPoints={currentPoints}
        color={color}
        size={size}
      />
    </div>
  )
}
