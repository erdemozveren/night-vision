
// Math/Geometry

export default {

  // Distance from point to line
  // p1 = point, (p2, p3) = line
  point2line(p1, p2, p3) {

    const { area, base } = this.tri(p1, p2, p3)
    return Math.abs(this.tri_h(area, base))
  },

  // Distance from point to segment
  // p1 = point, (p2, p3) = segment
  point2seg(p1, p2, p3) {

    const { area, base } = this.tri(p1, p2, p3)
    // Vector projection
    const proj = this.dot_prod(p1, p2, p3) / base
    // Distance from left pin
    const l1 = Math.max(-proj, 0)
    // Distance from right pin
    const l2 = Math.max(proj - base, 0)
    // Normal
    const h = Math.abs(this.tri_h(area, base))
    return Math.max(h, l1, l2)
  },

  // Distance from point to ray
  // p1 = point, (p2, p3) = ray
  point2ray(p1, p2, p3) {

    const { area, base } = this.tri(p1, p2, p3)
    // Vector projection
    const proj = this.dot_prod(p1, p2, p3) / base
    // Distance from left pin
    const l1 = Math.max(-proj, 0)
    // Normal
    const h = Math.abs(this.tri_h(area, base))
    return Math.max(h, l1)
  },

  tri(p1, p2, p3) {
    const area = this.area(p1, p2, p3)
    const dx = p3[0] - p2[0]
    const dy = p3[1] - p2[1]
    const base = Math.sqrt(dx * dx + dy * dy)
    return { area, base }
  },

  /* Area of triangle:
            p1
          /    \
        p2  _  p3
    */
  area (p1, p2, p3) {
	     return (
      p1[0] * (p2[1] - p3[1]) +
             p2[0] * (p3[1] - p1[1]) +
             p3[0] * (p1[1] - p2[1])
    )
  },

  // Triangle height
  tri_h(area, base) {
	    return area / base
  },

  // Dot product of (p2, p3) and (p2, p1)
  dot_prod(p1, p2, p3) {
    const v1 = [p3[0] - p2[0], p3[1] - p2[1]]
    const v2 = [p1[0] - p2[0], p1[1] - p2[1]]
    return v1[0] * v2[0] + v1[1] * v2[1]
  },

  // Symmetrical log
  log(x) {
    // TODO: log for small values
    return Math.sign(x) * Math.log(Math.abs(x) + 1)
  },

  // Symmetrical exp
  exp(x) {
    return Math.sign(x) * (Math.exp(Math.abs(x)) - 1)
  },

  // Middle line on log scale based on range & px height
  log_mid(r, h) {
    const log_hi = this.log(r[0])
    const log_lo = this.log(r[1])
    const px = h / 2
    const gx = log_hi -  px * (log_hi - log_lo) / h
    return this.exp(gx)
  },

  // Return new adjusted range, based on the previous
  // range, new $hi, target middle line
  re_range(r1, hi2, mid) {
    const log_hi1 = this.log(r1[0])
    const log_lo1 = this.log(r1[1])
    const log_hi2 = this.log(hi2)
    const log_$ = this.log(mid)

    const W = (log_hi2 - log_$) * (log_hi1 - log_lo1) /
                (log_hi1 - log_$)

    return this.exp(log_hi2 - W)

  },

  // Return new adjusted range, based on the previous
  // range, new $hi, target middle line + dy (shift)
  // WASTE
  /*range_shift(r1, hi2, mid, dy, h) {
        let log_hi1 = this.log(r1[0])
        let log_lo1 = this.log(r1[1])
        let log_hi2 = this.log(hi2)
        let log_$ = this.log(mid)

        let W = h * (log_hi2 - log_$) /
                (h * (log_hi1 - log_$) / (log_hi1 - log_lo1) + dy)

        return this.exp(log_hi2 - W)

    }*/

}
