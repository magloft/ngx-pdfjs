import { getDocument } from 'pdfjs-dist'
import { PDFDocumentLoadingTask } from 'pdfjs-dist/types/display/api'
import { PdfDocument } from './PdfDocument'

export class PdfLoader {
  async load(title: string, source: any, onProgress?: (event: ProgressEvent) => void, scale?: number) {
    const loadingTask: PDFDocumentLoadingTask = getDocument(source)
    loadingTask.onProgress = onProgress
    const proxy = await loadingTask.promise
    return new PdfDocument(title, proxy, scale)
  }
}
