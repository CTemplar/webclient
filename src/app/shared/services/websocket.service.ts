import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../store/services';
import { AppState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { WebSocketNewMessage } from '../../store/websocket.store';
import { LoggerService } from './logger.service';


@Injectable()
export class WebsocketService {
  private webSocket: WebSocket;

  constructor(private authService: UsersService,
              private store: Store<AppState>) {
  }

  public connect() {
    this.webSocket = new WebSocket(`${environment.webSocketUrl}?token=${this.authService.getToken()}`);
    this.webSocket.onmessage = (response) => {
      const data = JSON.parse(response.data);
      LoggerService.log('Web socket event:', data);
      this.store.dispatch(new WebSocketNewMessage(data));
    };

    this.webSocket.onclose = (e) => {
      if (this.authService.getToken()) {
        LoggerService.log('Socket is closed. Reconnect will be attempted in 3 second.', e.reason);
        setTimeout(() => {
          this.connect();
        }, 3000);
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
    this.webSocket.close();
  }
}

export interface Message {
  id: number;
  folder: string;
  parent_id?: number;
}
