import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxPdfModule } from '@magloft/ngx-pdfjs'
import { VerbosityLevel } from 'pdfjs-dist'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxPdfModule.forRoot({ verbosity: VerbosityLevel.INFOS })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
