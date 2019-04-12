import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../store/services';


@Injectable()
export class WebsocketService {
  public messages: Rx.Subject<any>;
  private subject: Rx.Subject<MessageEvent>;
  private webSocket: WebSocket;

  constructor(private authService: UsersService) {
  }

  public connect() {
    this.messages = <Rx.Subject<any>>this.connectSocket(`${environment.webSocketUrl}?token=${this.authService.getToken()}`)
      .pipe(
        map(
          (response: MessageEvent): any => {
            return JSON.parse(response.data);
          })
      );
  }

  private connectSocket(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Web socket successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    this.webSocket = ws;
    return Rx.Subject.create(observer, observable);
  }

  public disconnect() {
    if (this.messages) {
      this.messages.unsubscribe();
      this.webSocket.close();
      this.subject = null;
      console.log('Web socket successfully disconnected');
    }
  }
}
