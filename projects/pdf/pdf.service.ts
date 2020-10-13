import { Injectable } from '@angular/core'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { DocumentInitParameters, PDFDataRangeTransport, PDFDocumentLoadingTask, TypedArray } from 'pdfjs-dist/types/display/api'
import { PdfDocument } from './classes/PdfDocument'

@Injectable({ providedIn: 'root' })
export class NgxPdfService {
  constructor() {
    GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js'
  }

  async loadDocument(source: string | TypedArray | DocumentInitParameters | PDFDataRangeTransport, scale?: number, onProgress?: (event: ProgressEvent) => void) {
    const loadingTask: PDFDocumentLoadingTask = getDocument(source)
    loadingTask.onProgress = onProgress
    const proxy = await loadingTask.promise
    const document = new PdfDocument(proxy, scale)
    await document.process()
    return document
  }
}
