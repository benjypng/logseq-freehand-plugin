import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { useCallback, useEffect, useRef, useState } from 'react'

import { StrokeData } from '../../interfaces'
import { deserialize, serialize } from '../../utils'

export const useSyncLogseq = (sketchContainerUuid: string) => {
  const [strokes, setStrokes] = useState<StrokeData[]>([])

  const storageUuidRef = useRef<string | null>(null)

  useEffect(() => {
    let unsubscribe: any = null

    const init = async () => {
      const sketchContainerBlock = await logseq.Editor.getBlock(
        sketchContainerUuid,
        { includeChildren: true },
      )
      if (
        !sketchContainerBlock ||
        !sketchContainerBlock.children ||
        !sketchContainerBlock.children[0]
      )
        return
      const dataBlock = sketchContainerBlock.children[0] as BlockEntity
      if (!dataBlock) return

      storageUuidRef.current = dataBlock.uuid

      setStrokes(deserialize(dataBlock.title))

      unsubscribe = logseq.DB.onBlockChanged(dataBlock.uuid, async (block) => {
        const incoming = deserialize(block.title)

        setStrokes((prevStrokes) => {
          if (JSON.stringify(incoming) !== JSON.stringify(prevStrokes)) {
            return incoming
          }
          return prevStrokes
        })
      })
    }

    init()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [sketchContainerUuid])

  const saveStrokes = useCallback(async (newStrokes: StrokeData[]) => {
    if (storageUuidRef.current) {
      await logseq.Editor.updateBlock(
        storageUuidRef.current,
        serialize(newStrokes),
      )
    }
  }, [])

  const clearStrokes = async () => {
    setStrokes([])
    if (storageUuidRef.current) {
      await logseq.Editor.updateBlock(storageUuidRef.current, '')
    }
  }

  return { strokes, setStrokes, saveStrokes, clearStrokes }
}
