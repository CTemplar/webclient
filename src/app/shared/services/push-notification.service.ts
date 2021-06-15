import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/datatypes';
import { SnackErrorPush, SnackPush } from '../../store';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  public permission: Permission;

  constructor(private store: Store<AppState>) {
    if (this.isSupported()) {
      this.permission = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  isDefault() {
    return this.permission === 'default';
  }

  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(permission => {
          this.permission = permission;
        })
        .catch(() =>
          this.store.dispatch(new SnackErrorPush({ message: 'Failed to request permission for notification.' })),
        );
    }
  }

  create(title: string, options?: PushNotificationOptions): Observable<any> {
    if (!('Notification' in window)) {
      this.store.dispatch(new SnackPush({ message: 'Notifications are not available in this environment' }));
      return;
    }
    // eslint-disable-next-line consistent-return
    return new Observable(obs => {
      const notification = new Notification(title, options);
      notification.addEventListener('show', event => {
        return obs.next({
          notification,
          event,
        });
      });
      notification.addEventListener('click', event => {
        return obs.next({
          notification,
          event,
        });
      });
      notification.addEventListener('error', event => {
        return obs.error({
          notification,
          event,
        });
      });
      notification.onclose = () => {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    for (const item of source) {
      const options = {
        body: item.alertContent,
        icon: '../resource/images/bell-icon.png',
      };
      this.create(item.title, options).subscribe();
    }
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
}
