
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class NgxVirtualKeyboardService {

  public isOpened$: ReplaySubject<any> = new ReplaySubject(1);
  public layout$: ReplaySubject<any> = new ReplaySubject(1);
  public disabled$: ReplaySubject<boolean> = new ReplaySubject(1);
  public special$: ReplaySubject<boolean> = new ReplaySubject(1);
  public shift$: ReplaySubject<boolean> = new ReplaySubject(1);
  public capsLock$: ReplaySubject<boolean> = new ReplaySubject(1);
  public caretPosition$: ReplaySubject<number> = new ReplaySubject(1);

  private isOpened: boolean;
  private layout: any;
  private disabled: boolean;
  private capsLock: boolean = false;
  private shift: boolean;
  public special: boolean = false;

  public reset() {
    this.setShift(true);
    this.setSpecial(false);
    this.setOpen(false);
    this.setCapsLock(false);
  }

  public setOpen(value: boolean) {
    this.isOpened = value;
    this.isOpened$.next(this.isOpened);
  }

  public setShift(value: boolean) {
    this.shift = value;
    this.shift$.next(this.shift);

    this.setCapsLock(this.shift);
  }

  public setSpecial(value: boolean) {
    this.special = value;
    this.special$.next(this.special);
  }

  public setCapsLock(value: boolean) {
    this.capsLock = value;
    this.capsLock$.next(value);
  }

  public setCaretPosition(position: number) {
    this.caretPosition$.next(position);
  }

  public setDisabled(value: boolean) {
    this.disabled = value;
    this.disabled$.next(this.disabled);
  }

  public setLayout(value: any) {
    this.layout = value;
    this.layout$.next(this.layout);
  }

  public toggleShift(): void {
    this.shift = !this.shift;
    this.shift$.next(this.shift);

    this.setCapsLock(this.shift);
  }

  public toggleSpecial(): void {
    this.special = !this.special;
    this.special$.next(this.special);
  }

  public toggleCapsLock() {
    this.capsLock = !this.capsLock;
    this.capsLock$.next(this.capsLock);
  }

}
