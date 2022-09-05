import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { BoundingBox, EvaluatorElement, NgxPdfService } from '@magloft/ngx-pdfjs'

interface PdfImageElement {
  boundingBox: BoundingBox
  data: SafeUrl
}

interface PdfTextElement {
  boundingBox: BoundingBox
  text: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textColor: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public images?: PdfImageElement[] = []
  public texts?: EvaluatorElement[] = []
  public elementCode?: string
  private image?: HTMLImageElement

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>
  @ViewChild('code') codeRef: ElementRef<HTMLElement>

  constructor(public pdfjs: NgxPdfService, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    const document = await this.pdfjs.loadDocument('http://localhost:4200/assets/article-1.pdf')
    const page = document.getPage(1)

    // Debug Operators
    for (const operator of page.extractAll()) {
      for (const [key, value] of Object.entries(operator)) {
        console.info(key, value)
      }
    }

    // Extract Images
    this.images = (await page.extractImages()).map(({ boundingBox, data }) => {
      return { boundingBox, data: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)) } as PdfImageElement
    })

    // Extract Texts
    this.texts = await page.extractText()

    // Draw Canvas
    this.canvas.width = page.viewport.width
    this.canvas.height = page.viewport.height
    this.canvas.style.width = `${page.viewport.width}px`
    this.image = new Image()
    this.image.onload = () => { this.drawBackground() }
    this.image.src = URL.createObjectURL(await page.renderBlob())

    // Element Code
    this.elementCode = JSON.stringify(this.texts, null, 2)
  }

  async extractPages() {
    const document = await this.pdfjs.loadDocument('http://localhost:4200/assets/issue.pdf')
    const newDocument = await this.pdfjs.sliceDocument(document)
    console.info(`extracted ${newDocument.numPages} pages`)
  }

  onEnterText(text: PdfTextElement) {
    this.drawBackground()
    this.drawRect(text, '#508CF4', true)
    this.elementCode = JSON.stringify(text, null, 2)
  }

  onLeaveText() {
    this.drawBackground()
    this.elementCode = JSON.stringify([this.texts], null, 2)
  }

  printElements(texts: PdfTextElement[]) {
    return JSON.stringify(texts, null, 2)
  }

  renderText(value: string) {
    return (value.trim() === '') ? '&middot;' : value
  }

  private drawBackground() {
    const { context, image } = this
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
    for (const text of this.texts) {
      this.drawRect(text, 'rgba(0, 0, 0, 0.35)')
    }
  }

  private drawRect({ boundingBox: { left, top, width, height } }: EvaluatorElement, strokeStyle = '#000000', fill = false) {
    const { context } = this
    context.lineWidth = 1
    context.strokeStyle = strokeStyle
    context.beginPath()
    context.rect(left, top, width, height)
    context.stroke()
    if (fill) {
      context.fillStyle = '#508cf425'
      context.fill()
    }
  }

  get canvas() {
    return this.canvasRef.nativeElement
  }

  get context() {
    return this.canvas.getContext('2d')
  }
}
