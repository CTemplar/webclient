import { Directive, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: 'a[anchorScroll]',
})
export class AnchorScrollDirective implements AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  @Input()
  fragment: string;

  // wait for DOM to be ready for scrolling. 
  // Also this directive executing means that our target anchor is also ready
  ngAfterViewInit(): void {
    if (this.route?.snapshot?.fragment === this.fragment) {
      setTimeout(() => {
        document.querySelector(`#${this.fragment}`)?.scrollIntoView();
      });
    }
  }
}
