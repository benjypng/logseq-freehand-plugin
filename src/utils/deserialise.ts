export const deserialize = (content: string) => {
  try {
    const json = content.match(/```json\n([\s\S]*?)\n```/)?.[1]
    return json ? JSON.parse(json) : []
  } catch (e) {
    console.error(e)
    return []
  }
}
