// Drawing botbar with CanvasJS

import Const from '../../stuff/constants.js'
import Utils from '../../stuff/utils.js'

const {
  MINUTE15, MINUTE, HOUR,
  DAY, WEEK, MONTH, YEAR,
  MONTHMAP, HPX
} = Const

function body(props, layout, ctx) {

  const width = layout.botbar.width
  const height = layout.botbar.height

  const sb0 = layout.main.sbMax[0]
  const sb1 = layout.main.sbMax[1]

  ctx.font = props.config.FONT
  ctx.clearRect(0, 0, width, height)

  ctx.strokeStyle = props.colors.scale

  ctx.beginPath()
  ctx.moveTo(0, 0.5)
  ctx.lineTo(Math.floor(width + 1), 0.5)
  ctx.stroke()

  ctx.fillStyle = props.colors.text
  ctx.beginPath()

  for (var p of layout.botbar.xs) {

    const lbl = formatDate(props, p)
    const x = p[0] + sb0
    //if (p[0] - sb0 > width - sb1) continue

    ctx.moveTo(x + HPX, 0)
    ctx.lineTo(x + HPX, 4.5)

    if (!lblHighlight(props, p[1][0])) {
      ctx.globalAlpha = 0.85
    }
    ctx.textAlign = 'center'
    ctx.fillText(lbl, x, 18)
    ctx.globalAlpha = 1

  }

  ctx.stroke()

}

function panel(props, layout, ctx) {

  const lbl = formatCursorX(props)
  ctx.fillStyle = props.colors.panel

  const measure = ctx.measureText(lbl + '    ')
  const panwidth = Math.floor(measure.width + 10)
  const cursor = props.cursor.x + layout.main.sbMax[0]
  const x = Math.floor(cursor - panwidth * 0.5)
  const y = 1
  // TODO: limit panel movement
  //let w = layout.botbar.width - layout.main.sbMax[1]
  //x = Math.min(x, w - panwidth)
  const panheight = props.config.PANHEIGHT
  //ctx.fillRect(x, y, panwidth, panheight + 0.5)
  roundRect(ctx, x, y, panwidth, panheight + 0.5, 3)

  ctx.fillStyle = props.colors.textHL
  ctx.textAlign = 'center'
  ctx.fillText(lbl, cursor, y + 16)

}

function formatDate(props, p) {

  const t = p[1]
  const tf = props.timeFrame

  // Enable timezones only for tf < 1D
  const k = tf < DAY ? 1 : 0
  const tZ = t + k * props.timezone * HOUR

  //t += new Date(t).getTimezoneOffset() * MINUTE
  const d = new Date(tZ)

  if (p[2] === YEAR || Utils.yearStart(t) === t) {
    return d.getUTCFullYear()
  }
  if (p[2] === MONTH || Utils.monthStart(t) === t) {
    return MONTHMAP[d.getUTCMonth()]
  }
  // TODO(*) see gridMaker.js
  if (Utils.dayStart(tZ) === tZ) return d.getUTCDate()

  const h = Utils.addZero(d.getUTCHours())
  const m = Utils.addZero(d.getUTCMinutes())
  return h + ':' + m

}

function formatCursorX(props) {

  const t = props.cursor.time
  if (t === undefined) return 'Out of range'
  // TODO: IMPLEMENT TI
  const tf = props.timeFrame
  // Enable timezones only for tf < 1D
  const k = tf < DAY ? 1 : 0

  //t += new Date(t).getTimezoneOffset() * MINUTE
  const d = new Date(t + k * props.timezone * HOUR)

  if (tf === YEAR) {
    return d.getUTCFullYear()
  }

  if (tf < YEAR) {
    var yr = '`' + `${d.getUTCFullYear()}`.slice(-2)
    var mo = MONTHMAP[d.getUTCMonth()]
    var dd = '01'
  }
  if (tf <= WEEK) dd = d.getUTCDate()
  const date = `${dd} ${mo} ${yr}`
  let time = ''

  if (tf < DAY) {
    const h = Utils.addZero(d.getUTCHours())
    const m = Utils.addZero(d.getUTCMinutes())
    time = h + ':' + m
  }

  return `${date}  ${time}`

}

// Highlights the begining of a time interval
// TODO: improve. Problem: let's say we have a new month,
// but if there is no grid line in place, there
// will be no month name on t-axis. Sad.
// Solution: manipulate the grid, skew it, you know
function lblHighlight(props, t) {

  const tf = props.timeFrame

  if (t === 0) return true
  if (Utils.monthStart(t) === t) return true
  if (Utils.dayStart(t) === t) return true
  if (tf <= MINUTE15 && t % HOUR === 0) return true

  return false

}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, 0)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, 0)
  ctx.closePath()
  ctx.fill()
}

export default {
  body,
  panel
}
