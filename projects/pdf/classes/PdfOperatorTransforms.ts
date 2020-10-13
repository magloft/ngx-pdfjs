export type SetGStateOperator = {
  setLineWidth?: number,
  setLineCap?: number,
  setLineJoin?: number,
  setMiterLimit?: number,
  setDash?: number,
  setRenderingIntent?: any,
  setFlatness?: number,
  setFont?: [string, number],
  strokeAlpha?: number,
  fillAlpha?: number,
  globalCompositeOperation?: any
}
export type PaintXObjectOperator = { objectId: string, width: number, height: number }
export type SetFontOperator = { objectId: string, size: number }
export type ShowTextOperator = { text: string, width: number }
export type MoveTextOperator = { left: number, bottom: number }
export type SetLeadingMoveTextOperator = { left: number, bottom: number }

export interface Operators {
  transform: number[]
  setGState: SetGStateOperator
  paintXObject: PaintXObjectOperator
  paintImageXObject: PaintXObjectOperator
  paintJpegXObject: PaintXObjectOperator
  showText: ShowTextOperator
  setFillRGBColor: string
  setFont: SetFontOperator
  moveText: MoveTextOperator
  setLeadingMoveText: SetLeadingMoveTextOperator
  beginText: null
  endText: null
  setTextMatrix: number[]
}

export function setGState([args]: [string, any][][]): SetGStateOperator {
  const state = Object.fromEntries(args)
  const result: SetGStateOperator = {}
  if (state.LW) { result.setLineWidth = state.LW }
  if (state.LC) { result.setLineCap = state.LC }
  if (state.LJ) { result.setLineJoin = state.LJ }
  if (state.ML) { result.setMiterLimit = state.ML }
  if (state.D) { result.setDash = state.D }
  if (state.RI) { result.setRenderingIntent = state.RI }
  if (state.FL) { result.setFlatness = state.FL }
  if (state.Font) { result.setFont = state.Font }
  if (state.CA) { result.strokeAlpha = state.CA }
  if (state.ca) { result.fillAlpha = state.ca }
  if (state.BM) { result.globalCompositeOperation = state.BM }
  return result
}

export function paintImageXObject([objectId, width, height]: [string, number, number]): PaintXObjectOperator {
  return { objectId, width, height }
}

export function paintJpegXObject([objectId, width, height]: [string, number, number]): PaintXObjectOperator {
  return { objectId, width, height }
}

export function showText([items]: { unicode: string, width: number }[][]): ShowTextOperator {
  const valid = items.filter((item) => typeof item !== 'number')
  return {
    text: valid.map(({ unicode }) => unicode).join(''),
    width: valid.reduce((cur, { width }) => cur + width / 1000, 0)
  }
}

export function setFillRGBColor([r, g, b]: number[]): string {
  const hex = [r, g, b].map((value) => value.toString(16).padStart(2, '0'))
  return `#${hex.join('')}`
}

export function setFont([objectId, size]: [string, number]): SetFontOperator {
  return { objectId, size }
}

export function moveText([left, bottom]: [number, number]): MoveTextOperator {
  return { left, bottom }
}

export function setLeadingMoveText([left, bottom]: [number, number]): MoveTextOperator {
  return { left, bottom }
}
