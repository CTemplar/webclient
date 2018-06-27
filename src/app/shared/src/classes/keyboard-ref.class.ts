import { OverlayRef } from '@angular/cdk/overlay';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MatKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';

/**
 * Reference to a keyboard dispatched from the keyboard service.
 */
export class MatKeyboardRef<T> {

  /** Subject for notifying the user that the keyboard has closed. */
  private _afterClosed: Subject<any> = new Subject();

  /** Subject for notifying the user that the keyboard has opened and appeared. */
  private _afterOpened: Subject<any> = new Subject();

  /** The instance of the component making up the content of the keyboard. */
  instance: MatKeyboardComponent;

  /** The instance of the component making up the content of the keyboard. */
  containerInstance: MatKeyboardContainerComponent;

  constructor(instance: MatKeyboardComponent,
              containerInstance: MatKeyboardContainerComponent,
              private _overlayRef: OverlayRef) {
    // Sets the readonly instance of the keyboard content component.
    this.instance = instance;
    this.containerInstance = containerInstance;

    // Finish dismiss on exitting
    containerInstance.onExit.subscribe(() => this._finishDismiss());
  }

  /** Dismisses the keyboard. */
  dismiss() {
    if (!this._afterClosed.closed) {
      this.containerInstance.exit();
    }
  }

  /** Marks the keyboard as opened */
  _open() {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  /** Gets an observable that is notified when the keyboard is finished closing. */
  afterDismissed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  /** Gets an observable that is notified when the keyboard has opened and appeared. */
  afterOpened(): Observable<void> {
    return this.containerInstance.onEnter;
  }

  /** Cleans up the DOM after closing. */
  private _finishDismiss() {
    this._overlayRef.dispose();

    this._afterClosed.next();
    this._afterClosed.complete();
  }
}
