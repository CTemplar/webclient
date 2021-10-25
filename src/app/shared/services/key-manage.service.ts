import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyManageService implements OnDestroy {
  get ctrlAKeyTrigger$(): Observable<boolean> {
    return this._ctrlAKeyTrigger$.asObservable();
  }

  private _ctrlAKeyTrigger$: Subject<boolean> = new Subject<boolean>();

  private destroy$ = new Subject();

  private isCtrlAPressed = false;

  constructor() {}

  public onPressCtrlAKey() {
    this._ctrlAKeyTrigger$.next(!this.isCtrlAPressed);
    this.isCtrlAPressed = !this.isCtrlAPressed;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
