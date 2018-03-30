import { Component, HostBinding, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Fire events once app has been initialized - this code scroll to the top of each page on routing
    this.router.events.subscribe(params => window.scrollTo(0, 0));
  }

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
