import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { useCallback, useEffect, useState } from 'react'

import { StrokeData } from '../../interfaces'
import { deserialize, serialize } from '../../utils'

export const useSyncLogseq = (sketchContainerUuid: string) => {
  const [strokes, setStrokes] = useState<StrokeData[]>([])
  const [storageUuid, setStorageUuid] = useState<string | null>(null)

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
      setStorageUuid(dataBlock.uuid)
      setStrokes(deserialize(dataBlock.title))

      unsubscribe = logseq.DB.onBlockChanged(dataBlock.uuid, () => {
        const incoming = deserialize(dataBlock.title)
        if (JSON.stringify(incoming) !== JSON.stringify(strokes)) {
          setStrokes(incoming)
        }
      })
    }

    init()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [sketchContainerUuid])

  const saveStrokes = useCallback(
    async (newStrokes: StrokeData[]) => {
      if (storageUuid) {
        await logseq.Editor.updateBlock(storageUuid, serialize(newStrokes))
      }
    },
    [storageUuid],
  )

  const clearStrokes = async () => {
    setStrokes([])
    if (storageUuid) {
      await logseq.Editor.updateBlock(storageUuid, '')
    }
  }

  return { strokes, setStrokes, saveStrokes, clearStrokes }
}
