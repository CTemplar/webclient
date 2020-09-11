import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs/internal/observable/empty';

import { TimezoneActionTypes, TimezoneGet, TimezoneGetSuccess } from '../actions/timezone.action';
import { TimezoneService } from '../services/timezone.service';

@Injectable()
export class TimezoneEffects {
  constructor(private actions: Actions, private timezoneService: TimezoneService) {}

  @Effect()
  getTimezones: Observable<any> = this.actions.pipe(
    ofType(TimezoneActionTypes.TIMEZONE_GET),
    map((action: TimezoneGet) => action.payload),
    switchMap(payload => {
      return this.timezoneService.getTimezones().pipe(
        map(timezones => {
          return new TimezoneGetSuccess(timezones);
        }),
        catchError(error => EMPTY),
      );
    }),
  );
}
