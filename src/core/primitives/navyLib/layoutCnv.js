// Calculations for candles & volume overlays
// DEPRECATED

import Utils from '../../../stuff/utils.js'
import Const from '../../../stuff/constants.js'

const HPX = Const.HPX

// Calulate positions & sizes for candles (if $c),
// volume bars (if $v), or both by default
export default function layoutCnv(core, $c = true, $v = true) {

  const config = core.props.config
  const interval = core.props.interval
  const data = core.data
  const time2x = core.layout.time2x
  const layout = core.layout
  const view = core.view
  const volIndex = 5 // Volume data index

  const candles = []
  const volume = []

  // The volume bar height is determined as a percentage of
  // the chart's height (VOLSCALE)

  if ($v) {
    var maxv = maxVolume(core.dataSubset, volIndex)
    var vs = config.VOLSCALE * layout.height / maxv
  }
  var x1, x2, mid, prev = undefined
  const { A, B, pxStep } = layout
  const w = pxStep * config.CANDLEW

  const splitter = pxStep > 5 ? 1 : 0

  // A & B are current chart transformations:
  // A === scale,  B === Y-axis shift
  for (var i = view.i1, n = view.i2; i <= n; i++) {
    const p = data[i]
    mid = time2x(p[0]) + 1

    // Clear volume bar if there is a time gap
    if (data[i - 1] && p[0] - data[i - 1][0] > interval) {
      prev = null
    }

    // TODO: add log scale support
    if ($c) candles.push({
      x: mid,
      w: w,
      o: Math.floor(p[1] * A + B),
      h: Math.floor(p[2] * A + B),
      l: Math.floor(p[3] * A + B),
      c: Math.floor(p[4] * A + B),
      src: p
    })

    if ($v) {
      x1 = prev || Math.floor(mid - pxStep * 0.5)
      x2 = Math.floor(mid + pxStep * 0.5) + HPX
      volume.push({
        x1: x1,
        x2: x2,
        h: p[5] * vs,
        green: p[4] >= p[1],
        src: p
      })
    }

    prev = x2 + splitter
  }

  return { candles, volume }

}

function maxVolume(data, index) {
  let max = 0
  for (var i = 0; i < data.length; i++) {
    const val = data[i][index]
    if (val > max) max = val
  }
  return max
}
