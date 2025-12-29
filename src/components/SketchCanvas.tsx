import { getStroke } from 'perfect-freehand'

import { Point, StrokeData } from '../interfaces'
import { getSvgPathFromStroke } from '../utils'

export const SketchCanvas = ({
  strokes,
  currentPoints,
  color,
  size,
}: {
  strokes: StrokeData[]
  currentPoints: Point[]
  color: string
  size: number
}) => {
  return (
    <svg className="freehand-canvas">
      {strokes.map((stroke, index) => {
        if (stroke.points.length < 2) return null

        const outline = getStroke(stroke.points, {
          size: stroke.size,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })

        return (
          <path
            key={index}
            className="freehand-stroke"
            d={getSvgPathFromStroke(outline as Point[])}
            fill={stroke.color}
          />
        )
      })}

      {currentPoints.length > 1 && (
        <path
          className="freehand-stroke-preview"
          d={getSvgPathFromStroke(
            getStroke(currentPoints, {
              size,
              thinning: 0.5,
              smoothing: 0.5,
              streamline: 0.5,
            }) as Point[],
          )}
          fill={color}
        />
      )}
    </svg>
  )
}
