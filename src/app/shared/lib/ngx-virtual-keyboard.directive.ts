import {
  HostListener,
  ApplicationRef,
  Directive,
  ComponentFactoryResolver,
  Input, ComponentRef,
  EmbeddedViewRef, Injector, ElementRef, ViewChild, EventEmitter, Output
} from '@angular/core';
import { NgxVirtualKeyboardComponent } from './ngx-virtual-keyboard.component';
import { NgxVirtualKeyboardService } from './ngx-virtual-keyboard.service';

import {
  alphanumericKeyboard,
  azertyKeyboard,
  extendedKeyboard,
  KeyboardLayout,
  numericKeyboard,
  phoneKeyboard
} from './layouts';

@Directive({
  selector: '[ngx-virtual-keyboard], [ngx-virtual-keyboard]="true"'
})

export class NgxVirtualKeyboardDirective {
  @Input('ngx-virtual-keyboard') isActive: boolean;
  @Input('ngx-virtual-keyboard-layout') layout: KeyboardLayout | string;
  @Input('ngx-virtual-keyboard-disabled') isDisabled: boolean;
  @Output() ngModelChange = new EventEmitter();
  private isOpened: boolean = false;
  private isMouseEvent: boolean = false;
  private componentRef: ComponentRef<any>;
  private location: Element;
  private componentRootNode: any;
  private type: any;

  constructor(
    private _elRef: ElementRef,
    private _appRef: ApplicationRef,
    private _compiler: ComponentFactoryResolver,
    private _injector: Injector,
    private _vk: NgxVirtualKeyboardService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngAfterContentInit() {
    this.location = this.getRootViewContainerNode();
  }

  @HostListener('mousedown')
  onClickInput() {
    // this._vk.setOpen(false);
    this.isMouseEvent = true;
  }

  @HostListener('focus')
  onFocus() {
    if (!this.isMouseEvent && !this._elRef.nativeElement.id.includes('noSpan')) {
      this.isMouseEvent = false;
      this._vk.setOpen(false);
      this.clean();
      this.loadComponent();
      this.openKeyboard();
    } else {
      this.isMouseEvent = false;
      if (this._elRef.nativeElement.id.includes('noSpan') && this.componentRef && this.componentRef.instance) {
        this.componentRef.instance.close();
      }
    }
  }

  ngOnDestroy(): void {
    // this._elRef.nativeElement.id += 'noSpan';
    this.clean();
  }

  ngOnChanges(args: any[]) {
    if (args['isDisabled'] && this.componentRef) {
      this._vk.setDisabled(args['isDisabled'].currentValue);
    }
  }

  private loadComponent() {
    const layout = this.getLayout();
    const componentFactory = this._compiler.resolveComponentFactory(NgxVirtualKeyboardComponent);
    this.componentRef = componentFactory.create(this._injector);
    this.componentRef.instance.layout = layout;
    this.componentRef.instance.temp = layout;
    this.componentRef.instance.inputElement = this._elRef;
    this.componentRef.instance.location = this.location;
    this.componentRef.instance.type = this.type;
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRootNode = this.getComponentRootNode(this.componentRef);
  }

  private getRootViewContainer(): ComponentRef<any> {
    if (this.componentRef) {
      return this.componentRef;
    }

    const rootComponents = this._appRef.components;
    if (rootComponents.length) {
      return rootComponents[0];
    }

    throw new Error('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer.');
  }

  private getRootViewContainerNode() {
    return this.getComponentRootNode(this.getRootViewContainer());
  }

  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  private openKeyboard() {
    this.location.appendChild(this.componentRootNode);
    this.scrollTo();
  }

  private getLayout(): KeyboardLayout {
    let layout;
    this.type = this.layout;

    switch (this.layout) {
      case 'alphanumeric':
        layout = alphanumericKeyboard;
        break;
      case 'azerty':
        layout = azertyKeyboard;
        break;
      case 'extended':
        layout = extendedKeyboard;
        break;
      case 'numeric':
        layout = numericKeyboard;
        break;
      case 'phone':
        layout = phoneKeyboard;
        break;
      default:
        layout = this.layout;
        break;
    }

    return layout;
  }

  private clean() {
    this._vk.reset();
    if (this.componentRef && this.componentRef.instance.layoutSubscription) {
      this.componentRef.instance.layoutSubscription.unsubscribe();
      this.componentRef.instance.shiftSubscription.unsubscribe();
      this.componentRef.instance.capsLockSubscription.unsubscribe();
      this.componentRef.instance.caretPositionSubscription.unsubscribe();
      this.componentRef.instance.disabledSubscription.unsubscribe();
      this.componentRef.instance.specialSubscription.unsubscribe();
    }

    const body = document.getElementsByTagName('body')[0];
    body.style.paddingBottom = '0px';

    if (this.isActive) {
      this.ngModelChange.emit(this._elRef.nativeElement.value);
    }

    const virtualKeyboard = this.location.querySelector('virtual-keyboard');
    if (virtualKeyboard) {
      virtualKeyboard.remove();
    }
  }

  private findPos(obj) {
    let curtop = 0;
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return [curtop];
    }
  }

  private scrollTo() {
    const body = document.getElementsByTagName('body');
    const posElm = this.findPos(this._elRef.nativeElement)[0];
    const paddingBottom = window.innerHeight * .30;
    body[0].style.paddingBottom = `${paddingBottom}px`;
    window.scroll(0, posElm - paddingBottom);
  }
}
