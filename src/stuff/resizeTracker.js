// Track chart container boundraries & update
// the chart props

export default function resizeTracker(chart) {

  const resizeObserver = new ResizeObserver(() => {
    const rect = chart.root.getBoundingClientRect()
    chart.width = rect.width
    chart.height = rect.height
  })
  resizeObserver.observe(chart.root)
}
