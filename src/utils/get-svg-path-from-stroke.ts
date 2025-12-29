export type Point = [number, number, number?]

export const getSvgPathFromStroke = (points: Point[]): string => {
  if (points.length === 0 || !points[0] || !points[1]) return ''
  if (points.length < 2) return ''

  const pathCommands: (string | number)[] = [
    'M',
    points[0][0],
    points[0][1],
    'Q',
  ]

  for (let index = 0; index < points.length; index++) {
    const [currentX, currentY] = points[index]!
    const [nextX, nextY] = points[(index + 1) % points.length]!

    const controlPointX = (currentX + nextX) / 2
    const controlPointY = (currentY + nextY) / 2

    pathCommands.push(currentX, currentY, controlPointX, controlPointY)
  }

  pathCommands.push('Z')

  return pathCommands.join(' ')
}
