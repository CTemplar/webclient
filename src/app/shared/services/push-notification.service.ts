import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/datatypes';
import { SnackPush } from '../../store/actions';
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  public permission: Permission;

  constructor(private store: Store<AppState>) {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  isGranted() {
    return this.permission === 'granted';
  }

  requestPermission(): void {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return (self.permission = status);
      });
    }
  }

  create(title: string, options?: PushNotificationOptions): any {
    const self = this;
    if (!('Notification' in window)) {
      this.store.dispatch(new SnackPush({ message: 'Notifications are not available in this environment' }));
      return;
    }
    if (self.permission !== 'granted') {
      this.store.dispatch(
        new SnackPush({ message: "The user hasn't granted you permission to send push notifications" }),
      );
      return;
    }
    return new Observable(function (obs) {
      const _notify = new Notification(title, options);
      _notify.addEventListener('show', function (e) {
        return obs.next({
          notification: _notify,
          event: e,
        });
      });
      _notify.addEventListener('click', function (e) {
        return obs.next({
          notification: _notify,
          event: e,
        });
      });
      _notify.addEventListener('error', function (e) {
        return obs.error({
          notification: _notify,
          event: e,
        });
      });
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    const self = this;
    source.forEach(item => {
      const options = {
        body: item.alertContent,
        icon: '../resource/images/bell-icon.png',
      };
      const notify = self.create(item.title, options).subscribe();
    });
  }
}

export declare type Permission = 'denied' | 'granted' | 'default';

export class PushNotificationOptions {
  body?: string;

  icon?: string;

  tag?: string;

  data?: any;

  renotify?: boolean;

  silent?: boolean;

  sound?: string;

  noscreen?: boolean;

  sticky?: boolean;

  dir?: 'auto' | 'ltr' | 'rtl';

  lang?: string;

  vibrate?: number[];
}
