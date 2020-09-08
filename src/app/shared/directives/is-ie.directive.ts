import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { BrowserDetectorService } from '../services/browser-detector.service';

@Directive({
  selector: '[showInIE]'
})
export class IsIeDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private browserDetector: BrowserDetectorService
  ) {}

  @Input()
  set showInIE(val) {
    if (val) {
      if (this.browserDetector.isIEBrowser()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    } else {
      if (!this.browserDetector.isIEBrowser()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
}
