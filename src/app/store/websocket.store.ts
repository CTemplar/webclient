import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

import { Message } from '../shared/services/websocket.service';

export enum WebSocketActionTypes {
  WEB_SOCKET_NEW_MESSAGE = '[WEB_SOCKET] New Message',
  WEB_SOCKET_CLOSE = '[WEB_SOCKET] Close',
}

export class WebSocketNewMessage implements Action {
  readonly type = WebSocketActionTypes.WEB_SOCKET_NEW_MESSAGE;

  constructor(public payload: any) {}
}

export class WebSocketClose implements Action {
  readonly type = WebSocketActionTypes.WEB_SOCKET_CLOSE;

  constructor(public payload: any) {}
}

export type WebSocketActionAll = WebSocketNewMessage | WebSocketClose;

@Injectable({
  providedIn: 'root',
})
export class WebSocketEffects {
  constructor(private actions: Actions) {}

  @Effect()
  webSocketNewMessage: Observable<any> = this.actions.pipe(
    ofType(WebSocketActionTypes.WEB_SOCKET_NEW_MESSAGE),
    map((action: WebSocketNewMessage) => action.payload),
    switchMap(payload => {
      return of(EMPTY);
    }),
  );

  @Effect()
  webSocketClose: Observable<any> = this.actions.pipe(
    ofType(WebSocketActionTypes.WEB_SOCKET_CLOSE),
    map((action: WebSocketClose) => action.payload),
    switchMap(payload => {
      return of(EMPTY);
    }),
  );
}

export interface WebSocketState {
  message?: Message;
  isClosed?: boolean;
}

export function reducer(state: WebSocketState = {}, action: WebSocketActionAll) {
  switch (action.type) {
    case WebSocketActionTypes.WEB_SOCKET_NEW_MESSAGE: {
      return { message: action.payload, isClosed: false };
    }

    case WebSocketActionTypes.WEB_SOCKET_CLOSE: {
      return { isClosed: true, message: null };
    }

    default: {
      return state;
    }
  }
}
