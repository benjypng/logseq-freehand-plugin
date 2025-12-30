import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { SketchContainer } from './components/SketchContainer'
import freehandPluginCss from './index.css?raw'
import { settings } from './settings'
import { getStableId } from './utils'

const main = async () => {
  logseq.UI.showMsg('logseq-freehand-plugin loaded')
  logseq.provideStyle(freehandPluginCss)

  logseq.Editor.registerSlashCommand('Freehand: Start sketching', async (e) => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :freehand_${e.uuid}}}`,
    )
    await logseq.Editor.insertBlock(e.uuid, '', {
      sibling: false,
    })
    await logseq.Editor.setBlockCollapsed(e.uuid, { flag: true })
    await logseq.Editor.exitEditingMode(false)
  })

  logseq.App.onMacroRendererSlotted(
    async ({
      slot,
      payload: { uuid: sketchContainerUuid, arguments: args },
    }) => {
      const [type] = args
      if (!type || !type.startsWith(':freehand_')) return

      const freehandId = getStableId(sketchContainerUuid, slot)
      const existingEl = parent.document.getElementById(freehandId)

      if (!existingEl) {
        logseq.provideUI({
          key: freehandId,
          slot,
          reset: true,
          template: `<div id="${freehandId}" style="width: 800px; height: 400px; margin-top: 10px;"></div>`,
        })
      }

      setTimeout(async () => {
        const el = parent.document.getElementById(freehandId)
        if (!el || !el.isConnected) return

        let root = (el as any)._reactRoot
        if (!root) {
          root = createRoot(el)
          ;(el as any)._reactRoot = root
        }

        root.render(
          <SketchContainer sketchContainerUuid={sketchContainerUuid} />,
        )
      }, 50)
    },
  )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
