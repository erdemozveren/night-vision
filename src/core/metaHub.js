
// Container for y-transforms, meta functions, other info
// about overlays (e.g. yRange)

import Utils from '../stuff/utils.js'
import Events from './events.js'
import DataHub from './dataHub.js'

class MetaHub {

  constructor(nvId) {

    const events = Events.instance(nvId)
    this.hub = DataHub.instance(nvId)
    this.events = events

    // EVENT INTERFACE
    events.on('meta:sidebar-transform', this.onYTransform.bind(this))
    events.on('meta:select-overlay', this.onOverlaySelect.bind(this))
    events.on('meta:grid-mousedown', this.onGridMousedown.bind(this))
    events.on('meta:scroll-lock', this.onScrollLock.bind(this))

    // Persistent meta storage
    this.storage = {}
  }

  init(props) {

    this.panes = 0 // Panes processed
    this.ready = false
    // [API] read-only
    this.legendFns = [] // Legend formatters
    this.yTransforms = [] // yTransforms of sidebars
    this.preSamplers = [] // Auto-precision samplers
    this.yRangeFns = [] // yRange functions of overlays
    this.autoPrecisions = [] // Auto-precision for overlays
    this.valueTrackers = [] // Price labels + price lines
    // TODO: legend formatters ...
    // TODO: last values
    this.selectedOverlay = undefined
    /* OHLC Map format: {
            timestamp: {
                ref: [], // Reference to n-th data item
                index: n // Item global index
            }, ...
        }*/
    this.ohlcMap = [] // time => OHLC map of the main ov
    this.ohlcFn = undefined // OHLC mapper function
    this.scrollLock = false // Scroll lock state

  }

  // Extract meta functions from overlay
  exctractFrom(overlay) {
    const gridId = overlay.gridId()
    const id = overlay.id()

    // yRange functions
    var yrfs = this.yRangeFns[gridId] || []
    yrfs[id] = overlay.yRange ? {
      exec: overlay.yRange,
      preCalc: overlay.yRangePreCalc
    } : null

    // Precision samplers
    var aps = this.preSamplers[gridId] || []
    aps[id] = overlay.preSampler

    // Legend formatters
    var lfs = this.legendFns[gridId] || []
    lfs[id] = {
      legend: overlay.legend,
      legendHtml: overlay.legendHtml,
      noLegend: overlay.noLegend ?? false
    }

    // Value trackers
    var vts = this.valueTrackers[gridId] || []
    vts[id] = overlay.valueTracker

    // Ohlc mapper function
    const main = this.hub.overlay(gridId, id).main
    if (main) {
      this.ohlcFn = overlay.ohlc
    }

    this.yRangeFns[gridId] = yrfs
    this.preSamplers[gridId] = aps
    this.legendFns[gridId] = lfs
    this.valueTrackers[gridId] = vts

  }

  // Maps timestamp => ohlc, index
  // TODO: should add support for indexBased? 
  calcOhlcMap() {
    this.ohlcMap = {}
    const data = this.hub.mainOv.data
    for (var i = 0; i < data.length; i++) {
      this.ohlcMap[data[i][0]] = {
        ref: data[i],
        index: i
      }
    }
  }

  // Store auto precision for a specific overlay
  setAutoPrec(gridId, ovId, prec) {
    const aps = this.autoPrecisions[gridId] || []
    aps[ovId] = prec
    this.autoPrecisions[gridId] = aps
  }

  // Call this after all overlays are processed
  // We need to make an update to apply freshly
  // extracted functions
  // TODO: probably can do better
  finish() {
    this.panes++
    if (this.panes < this.hub.panes().length) return
    this.autoPrecisions = [] // wait for preSamplers
    //this.restore()
    this.calcOhlcMap()
    this.ready = true
    setTimeout(() => {
      this.events.emitSpec('chart', 'update-layout')
      this.events.emit('update-legend')
    })
  }

  // Store some meta info such as ytransform by
  // (pane.uuid + scaleId) hash
  store() {
    this.storage = {}
    const yts = this.yTransforms || []
    for (var paneId in yts) {
      const paneYts = yts[paneId]
      const pane = this.hub.panes()[paneId]
      if (!pane) continue
      for (var scaleId in paneYts) {
        const hash = `yts:${pane.uuid}:${scaleId}`
        this.storage[hash] = paneYts[scaleId]
      }
    }

  }

  // Restore that info after an update in the
  // pane/overlay order
  restore() {
    const yts = this.yTransforms
    for (var hash in this.storage) {
      const [type, uuid1, uuid2] = hash.split(':')
      const pane = this.hub.panes().find(x => x.uuid === uuid1)
      if (!pane) continue
      switch(type) {
      case 'yts': // Y-transforms
        if (!yts[pane.id]) yts[pane.id] = []
        yts[pane.id][uuid2] =  this.storage[hash]
        break
      }
    }
    this.store() // Store new state
  }

  // [API] Get y-transform of a specific scale
  getYtransform(gridId, scaleId) {
    return (this.yTransforms[gridId] || [])[scaleId]
  }

  // [API] Get auto precision of a specific overlay
  getAutoPrec(gridId, ovId) {
    return (this.autoPrecisions[gridId] || [])[ovId]
  }

  // [API] Get a precision smapler of a specific overlay
  getPreSampler(gridId, ovId) {
    return (this.preSamplers[gridId] || [])[ovId]
  }

  // [API] Get legend formatter of a specific overlay
  getLegendFns(gridId, ovId) {
    return (this.legendFns[gridId] || [])[ovId]
  }

  // [API] Get OHLC values to use as "magnet" values
  ohlc(t) {
    const el = this.ohlcMap[t]
    if (!el || !this.ohlcFn) return
    return this.ohlcFn(el.ref)
  }

  // EVENT HANDLERS

  // User changed y-range
  onYTransform(event) {
    const yts = this.yTransforms[event.gridId] || {}
    const tx = yts[event.scaleId] || {}
    yts[event.scaleId] = Object.assign(tx, event)
    this.yTransforms[event.gridId] = yts
    if (event.updateLayout) {
      this.events.emitSpec('chart', 'update-layout')
    }
    this.store()
  }

  // User tapped legend & selected the overlay
  onOverlaySelect(event) {
    this.selectedOverlay = event.index
    this.events.emit('$overlay-select', {
      index: event.index,
      ov: this.hub.overlay(...event.index)
    })
  }

  // User tapped grid (& deselected all overlays)
  onGridMousedown(event) {
    this.selectedOverlay = undefined
    this.events.emit('$overlay-select', {
      index: undefined,
      ov: undefined
    })
  }

  // Overlay/user set lock on scrolling
  onScrollLock(event) {
    this.scrollLock = event
  }
}


const instances = {}

function instance(id) {
  if (!instances[id]) {
    instances[id] = new MetaHub(id)
  }
  return instances[id]
}

export default { instance }
