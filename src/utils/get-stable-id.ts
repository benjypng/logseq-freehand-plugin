export const getStableId = (uuid: string, slot: string): string => {
  const slotEl = parent.document.getElementById(slot)
  return slotEl?.closest('#right-sidebar')
    ? `freehand_${uuid}_sidebar`
    : `freehand_${uuid}_main`
}
