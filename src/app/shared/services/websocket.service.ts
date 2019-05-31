import { Injectable } from '@angular/core';
import { UsersService } from '../../store/services';
import { AppState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { WebSocketNewMessage } from '../../store/websocket.store';
import { LoggerService } from './logger.service';
import { GetUnreadMailsCountSuccess, Logout } from '../../store/actions';
import { getWebsocketUrl } from '../config';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import { Mail } from '../../store/models';

@TakeUntilDestroy()
@Injectable()
export class WebsocketService implements OnDestroy {
  readonly destroyed$: Observable<boolean>;
  private webSocket: WebSocket;
  private retryCount = 1;
  private userId: number = Date.now();

  constructor(private authService: UsersService,
              private store: Store<AppState>) {
    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((userState: UserState) => {
        this.userId = userState.id ? userState.id : this.userId;
      });
  }

  public connect() {
    this.webSocket = new WebSocket(`${getWebsocketUrl()}?token=${this.authService.getToken()}&user_id=${this.userId}`);
    this.webSocket.onmessage = (response) => {
      const data = JSON.parse(response.data);
      LoggerService.log('Web socket event:', data);
      if (data.logout === true || data.reason === 'INVALID_TOKEN') {
        this.disconnect();
        this.store.dispatch(new Logout(data));
      } else {
        this.store.dispatch(new WebSocketNewMessage(data));
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

  ngOnDestroy(): void {
  }
}

export interface Message {
  id: number;
  folder: string;
  parent_id?: number;
  mail: Mail;
  total_count?: number;
  marked_as_read?: boolean;
  is_outbox_mail_sent?: boolean;
  unread_count_inbox?: number;
  unread_count_outbox?: number;

  /**
   * Id's list when a messsage is marked as read/unread.
   */
  ids?: Array<number>;
}
