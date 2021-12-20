import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  constructor(private elementReference: ElementRef) {}

  @Input()
  skipFirst = false;

  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  canEmit = false;

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementReference.nativeElement.contains(targetElement);
    if (!clickedInside) {
      // #1477 in cases like datepicker where we rely on this directive to close popup,
      // click outside is triggered as soon as the popup is opened and
      // it closes immediately. we are skipping the first outside click 
      // which is actually trigger that opened the popup
      if (!this.skipFirst || this.canEmit) {
        this.clickOutside.emit(event);
      }
      this.canEmit = true;
    }
  }
}
