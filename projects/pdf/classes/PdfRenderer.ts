import { PdfPage } from './PdfPage'

const PDF_RENDER_DEFAULTS = { type: 'image/jpeg', quality: 75 }

export interface PdfRenderOptions {
  width: number
  type: string
  quality: number
}

export class PdfRenderer {
  private canvas: HTMLCanvasElement = document.createElement('canvas')
  private context = this.canvas.getContext('2d')

  constructor() {}

  async renderPage(page: PdfPage, options: Partial<PdfRenderOptions>, preserveObjects = false) {
    const { width, type, quality } = { ...PDF_RENDER_DEFAULTS, width: page.viewport.width, ...options }
    const scale = width / page.view.width
    const viewport = page.getViewport({ scale })
    this.canvas.height = viewport.height
    this.canvas.width = viewport.width
    await page.render({ canvasContext: this.context, viewport }, preserveObjects)
    return this.toBlob(type, quality)
  }

  private async toBlob(type: string, quality: number) {
    return new Promise((resolve) => { this.canvas.toBlob(resolve, type, quality) })
  }
}
