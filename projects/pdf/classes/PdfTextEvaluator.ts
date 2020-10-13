import { PdfOperatorSelection } from './PdfOperatorSelection'
import { Operators } from './PdfOperatorTransforms'
import { BoundingBox, PdfPage } from './PdfPage'
import { parseFontName } from './PdfUtil'

export interface EvaluatorElement {
  text?: string
  textColor?: string
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  fontSize?: number
  boundingBox?: BoundingBox
}

export class PdfTextEvaluator {
  readonly elements: EvaluatorElement[] = []
  private current: EvaluatorElement

  private textColor?: string
  private fontFamily?: string
  private fontWeight?: string
  private fontStyle?: string
  private fontSize?: number

  private cursor: [number, number] = [0, 0]
  private leading: [number, number] = [0, 0]
  private charSpacing = 0
  private transformScale = 1

  constructor(private page: PdfPage) {}

  process(selection: PdfOperatorSelection) {
    for (const operator of selection.transform()) {
      this.processOperator(operator)
    }
  }

  private processOperator(operator: Partial<Operators>) {
    if ('showText' in operator) {
      const [x, y] = this.cursor
      const scale = this.fontSize * this.transformScale
      const width = operator.showText.width * scale
      const spacingOffset = operator.showText.length * this.charSpacing * scale
      const [left, bottom, right, top] = this.page.viewport.convertToViewportRectangle([
        x + this.leading[0],
        y + this.leading[1],
        x + width + this.leading[0] + spacingOffset,
        y + scale + this.leading[1]
      ])
      const element = this.nextElement()
      element.text = operator.showText.text
      element.textColor = this.textColor
      element.fontFamily = this.fontFamily
      element.fontWeight = this.fontWeight
      element.fontStyle = this.fontStyle
      element.fontSize = this.fontSize
      element.boundingBox = { left, right, top, bottom, width: right - left, height: bottom - top }
      this.leading[0] += width
    } else if ('setFillRGBColor' in operator) {
      this.textColor = operator.setFillRGBColor
    } else if ('setFont' in operator) {
      const font = this.page.getCommonObject(operator.setFont.objectId)
      const { fontFamily, fontStyle, fontWeight } = parseFontName(font.name)
      this.fontFamily = fontFamily
      this.fontStyle = fontStyle
      this.fontWeight = fontWeight
      this.fontSize = operator.setFont.size
    } else if ('setTextMatrix' in operator) {
      this.cursor = [operator.setTextMatrix[4], operator.setTextMatrix[5]]
      this.leading = [0, 0]
      this.transformScale = operator.setTextMatrix[0]
    } else if ('moveText' in operator) {
      this.cursor[0] += operator.moveText.left * this.transformScale
      this.cursor[1] += operator.moveText.bottom * this.transformScale
      this.leading = [0, 0]
    } else if ('setLeadingMoveText' in operator) {
      this.cursor[1] += this.leading[1]
      this.leading = [operator.setLeadingMoveText.left * this.transformScale, operator.setLeadingMoveText.bottom * this.transformScale]
    } else if ('setCharSpacing' in operator) {
      this.charSpacing = operator.setCharSpacing
    }
  }

  private nextElement() {
    this.current = {}
    this.elements.push(this.current)
    return this.current
  }
}
