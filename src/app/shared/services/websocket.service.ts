import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable()
export class WebsocketService {
  public messages: Rx.Subject<any>;
  private subject: Rx.Subject<MessageEvent>;

  constructor() {
    this.messages = <Rx.Subject<any>>this.connect(environment.webSocketUrl)
      .pipe(
        map(
          (response: MessageEvent): any => {
            return JSON.parse(response.data);
          })
      );
  }

  public connect(url): Rx.Subject<MessageEvent> {
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
    return Rx.Subject.create(observer, observable);
  }
}
