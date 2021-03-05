import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

import { BrowserDetectorService } from '../services/browser-detector.service';

@Directive({
  selector: '[showInIE]',
})
export class IsIeDirective {
  constructor(
    private templateReference: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private browserDetector: BrowserDetectorService,
  ) {}

  @Input()
  set showInIE(value: boolean) {
    if (value) {
      if (this.browserDetector.isIEBrowser()) {
        this.viewContainer.createEmbeddedView(this.templateReference);
      } else {
        this.viewContainer.clear();
      }
    } else if (!this.browserDetector.isIEBrowser()) {
      this.viewContainer.createEmbeddedView(this.templateReference);
    } else {
      this.viewContainer.clear();
    }
  }
}
