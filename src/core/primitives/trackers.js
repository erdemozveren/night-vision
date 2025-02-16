
// Scale value trackers (scale labels, price lines)

import Layer from '../layer.js'
import DataHub from '../dataHub.js'
import MetaHub from '../metaHub.js'
import sidebar from './sidebar.js'
import { priceLine } from './priceLine.js'
import Utils from '../../stuff/utils.js'

export default class Trackers extends Layer {

  constructor(id, props, gridId) {
    super(id, '__$Trackers__')

    this.id = id
    this.zIndex = 500000
    this.ctxType = 'Canvas'
    this.hub = DataHub.instance(props.id)
    this.meta = MetaHub.instance(props.id)
    this.gridId = gridId
    this.props = props

    this.overlay = {
      draw: this.draw.bind(this),
      destroy: this.destroy.bind(this),
      drawSidebar: this.drawSidebar.bind(this)
    }

    this.env = {
      update: this.envEpdate.bind(this),
      destroy: () => {}
    }

  }

  draw(ctx) {

    if (!this.layout) return

    // TODO: how to draw price line on non-main Scale?
    const trackers = this.meta.valueTrackers[this.gridId] || []
    this.trackers = []

    for (var i = 0; i < trackers.length; i++) {
      const vt = trackers[i]
      if (!vt) continue
      const data = this.hub.ovData(this.gridId, i) || []
      const last = data[data.length - 1] || []
      const tracker = vt(last)
      tracker.ovId = i

      if (!tracker.show || tracker.value === undefined) continue

      tracker.y = this.layout.value2y(tracker.value)
      tracker.color = tracker.color || this.props.colors.scale
      if (tracker.line){
        priceLine(this.layout, ctx, tracker)
      }

      // Save from repeating the loop
      this.trackers.push(tracker)
    }

  }

  drawSidebar(ctx, side, scale) {

    if (!this.layout) return

    for (var tracker of this.trackers || []) {
      const scaleId = this.getScaleId(tracker.ovId)
      if (scaleId !== scale.scaleSpecs.id) continue
      sidebar.tracker(
        this.props, this.layout, scale, side, ctx, tracker
      )
    }

  }

  envEpdate(ovSrc, layout, props) {
    this.ovSrc = ovSrc
    this.layout = layout
    this.props = props

    this.scaleId = this.getScaleId()
  }

  // Get the scale id of this overlay
  // TODO: more efficient method of getting ov scale
  getScaleId(ovId) {
    const scales = this.layout.scales
    for (var i in scales) {
      const ovIdxs = scales[i].scaleSpecs.ovIdxs
      if (ovIdxs.includes(ovId)) {
        return i
      }
    }
  }

  destroy() {}
}
