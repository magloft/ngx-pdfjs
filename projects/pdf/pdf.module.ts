import { CommonModule } from '@angular/common'
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { NgxPdfService } from './pdf.service'

export interface PdfjsConfig {
  verbosity: any
}

export const CONFIG_TOKEN = new InjectionToken<PdfjsConfig>(null)

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class NgxPdfModule {
  static forRoot(config: PdfjsConfig): ModuleWithProviders<NgxPdfModule> {
    return {
      ngModule: NgxPdfModule,
      providers: [NgxPdfService, { provide: CONFIG_TOKEN, useValue: config }]
    }
  }

  constructor(@Optional() @SkipSelf() parentModule: NgxPdfModule) {
    if (parentModule) {
      throw new Error('NgxPdfjsModule is already loaded. Import it in the AppModule only')
    }
  }
}
