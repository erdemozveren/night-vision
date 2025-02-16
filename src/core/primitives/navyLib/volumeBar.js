
// Fast volume bar

import Const from '../../../stuff/constants.js'

const HPX = Const.HPX

export default function volumeBar(ctx, data, layout) {

  const y0 = layout.height
  const w = Math.max(1, data.x2 - data.x1 + HPX)
  const h = data.h
  const x05 = (data.x2 + data.x1) * 0.5

  ctx.lineWidth = w

  ctx.moveTo(x05, y0 - h)
  ctx.lineTo(x05, y0)

}
