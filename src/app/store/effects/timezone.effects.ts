import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';




import { catchError, map } from 'rxjs/operators';
import { TimezoneActionTypes, TimezoneGet, TimezoneGetSuccess } from '../actions/timezone.action';
import { TimezoneService } from '../services/timezone.service';


@Injectable()
export class TimezoneEffects {

  constructor(
    private actions: Actions,
    private timezoneService: TimezoneService,
  ) {}

  @Effect()
  getTimezones: Observable<any> = this.actions
    .ofType(TimezoneActionTypes.TIMEZONE_GET)
    .map((action: TimezoneGet) => action.payload)
    .switchMap(payload => {
      return this.timezoneService.getTimezones()
        .pipe(
          map((timezones) => {
            return new TimezoneGetSuccess(timezones);
          }),
          catchError((error) => [])
        );
    });
}
