import { Injectable } from '@angular/core'
import { PDFDocument } from 'pdf-lib'
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

  async sliceDocument(document: PdfDocument, startIndex = 0, endIndex = document.numPages) {
    const buffer = await document.getData()
    const doc = await PDFDocument.load(buffer)
    for (let index = document.numPages - 1; index >= 0; index -= 1) {
      if (index < startIndex || index >= endIndex) {
        doc.removePage(index)
      }
    }
    const uint8Array = await doc.save()
    return this.loadDocument(uint8Array)
  }
}
