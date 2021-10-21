import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSelectManageService {
  get userSelectPosibilityState$(): Observable<boolean> {
    return this._userSelectPosibilityState$.asObservable();
  }

  private _userSelectPosibilityState$ = new BehaviorSubject<boolean>(false);
  constructor() {}

  updateUserSelectPossiblilityState(isPossible: boolean) {
    this._userSelectPosibilityState$.next(isPossible);
  }
}
