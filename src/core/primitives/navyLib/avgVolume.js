
// Average volume (SMA)

import { fastSma } from './helperFns.js'

export default function avgVolume(ctx, core, props, cnv, vIndex = 5) {

  const i1 = core.view.i1
  const i2 = core.view.i2
  const len = props.avgVolumeSMA
  const sma = fastSma(core.data, vIndex, i1, i2, len)
  const layout  = core.layout
  const maxv = cnv.maxVolume
  const vs = cnv.volScale
  const h = layout.height
  const h05 = core.props.config.VOLSCALE * 0.5 * h

  ctx.lineJoin = 'round'
  ctx.lineWidth = 0.75
  ctx.strokeStyle = props.colorAvgVol
  ctx.beginPath()

  // TODO: implement
  if (core.layout.indexBased) return

  const offset = core.data.length - sma.length

  // TODO: Calculate layout index offset
  for (var i = 0, n = sma.length; i < n; i++) {
    const x = layout.ti2x(sma[i][0], i + offset)
    const y = h - sma[i][1] * vs
    ctx.lineTo(x, y)
  }
  ctx.stroke()

}
