import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxPdfModule, VerbosityLevel } from 'ngx-pdfjs'
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
