
// Drawing candle body seperately (for speed-up)

export default function candleWick(ctx, data) {

  const x05 = data.x - 1

  ctx.moveTo(x05, Math.floor(data.h))
  ctx.lineTo(x05, Math.floor(data.l))

}
