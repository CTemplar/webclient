import { Component, HostBinding, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'app';

  /**
   * The below code is to disable transition on DOM elements on window resize. The css3 transition creats flickring effect on resize.
   */
  // Public property of boolean type set false by default
  public windowIsResized: boolean = false;
  public resizeTimeout: number = null;

  constructor(@Inject(DOCUMENT) private document: any) { }

  // == Listening to resize event for window object
  @HostListener("window:resize", ['$event'])
  onResize(event) {
    this.windowIsResized = true;
    if (this.resizeTimeout && this.windowIsResized) {
      this.windowIsResized = true;
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout((() => {
      this.windowIsResized = false;
    }).bind(this), 10);
  }
}
