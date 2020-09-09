// Ngrx
import { Action } from '@ngrx/store';

export enum TimezoneActionTypes {
  TIMEZONE_GET = '[TIMEZONE] GET',
  TIMEZONE_GET_SUCCESS = '[TIMEZONE] GET SUCCESS',
}

export class TimezoneGet implements Action {
  readonly type = TimezoneActionTypes.TIMEZONE_GET;

  constructor(public payload?: any) {}
}

export class TimezoneGetSuccess implements Action {
  readonly type = TimezoneActionTypes.TIMEZONE_GET_SUCCESS;

  constructor(public payload: any) {}
}

export type TimezoneActionAll = TimezoneGet | TimezoneGetSuccess;
