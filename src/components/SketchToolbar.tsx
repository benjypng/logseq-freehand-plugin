import { COLORS } from '../constants'

export const SketchToolbar = ({
  color,
  onColorChange,
  onClear,
}: {
  color: string
  onColorChange: (color: string) => void
  onClear: () => void
}) => {
  return (
    <div
      className="freehand-toolbar"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="freehand-color-picker">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`freehand-color-swatch ${
              color === c ? 'is-active' : ''
            }`}
            style={{ backgroundColor: c }}
            onPointerDown={() => onColorChange(c)}
          />
        ))}
      </div>

      <div className="freehand-toolbar-divider" />

      <button className="freehand-clear-button" onPointerDown={onClear}>
        Clear
      </button>
    </div>
  )
}
