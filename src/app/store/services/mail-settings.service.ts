import { Injectable } from '@angular/core';
import { SettingsUpdate } from '../actions';
import { AppState } from '../datatypes';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MailSettingsService {
  constructor(private store: Store<AppState>) {}

  updateSettings(settings: any, key?: string, value?: any) {
    if (key) {
      if (settings[key] !== value) {
        settings[key] = value;
        this.store.dispatch(new SettingsUpdate(settings));
      }
    } else {
      this.store.dispatch(new SettingsUpdate(settings));
    }
  }
}
