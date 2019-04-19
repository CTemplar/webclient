import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../store/services';
import { AppState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { WebSocketNewMessage } from '../../store/websocket.store';
import { LoggerService } from './logger.service';
import { GetUnreadMailsCountSuccess, Logout } from '../../store/actions';


@Injectable()
export class WebsocketService {
  private webSocket: WebSocket;
  private retryCount = 1;

  constructor(private authService: UsersService,
              private store: Store<AppState>) {
  }

  public connect() {
    this.webSocket = new WebSocket(`${environment.webSocketUrl}?token=${this.authService.getToken()}`);
    this.webSocket.onmessage = (response) => {
      const data = JSON.parse(response.data);
      LoggerService.log('Web socket event:', data);
      if (data.logout === true) {
        this.disconnect();
        this.store.dispatch(new Logout(data));
      } else {
        this.store.dispatch(new WebSocketNewMessage(data));
        this.store.dispatch(new GetUnreadMailsCountSuccess({ unread_count_inbox: data.unread_count_inbox }));
      }
    };

    this.webSocket.onclose = (e) => {
      if (this.authService.getToken()) {
        LoggerService.log(`Socket is closed. Reconnect will be attempted in ${(1000 + (this.retryCount * 1000))} second. ${e.reason}`);
        setTimeout(() => {
          this.connect();
          this.retryCount = this.retryCount + 1;
        }, (1000 + (this.retryCount * 1000)));
      } else {
        LoggerService.log('Socket is closed.');
      }
    };

    this.webSocket.onerror = (err: any) => {
      LoggerService.error('Socket encountered error: ', err.message, 'Closing socket');
      this.webSocket.close();
    };
  }

  public disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

export interface Message {
  id: number;
  folder: string;
  parent_id?: number;
}
