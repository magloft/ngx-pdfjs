import { Injectable } from '@angular/core'
import { GlobalWorkerOptions, VerbosityLevel } from 'pdfjs-dist'
import { PdfLoader } from './classes/PdfLoader'

export { VerbosityLevel }

@Injectable({ providedIn: 'root' })
export class NgxPdfService {
  constructor() {
    GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js'
  }

  load(title: string, source: any, scale?: number, onProgress?: (event: ProgressEvent) => void) {
    const loader = new PdfLoader()
    return loader.load(title, source, onProgress, scale)
  }
}
