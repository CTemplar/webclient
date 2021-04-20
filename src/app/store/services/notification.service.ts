import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import { AppState } from '../datatypes';
import { UndoDeleteMail } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private store: Store<AppState>) {}

  showSnackBar(message: string, action = 'CLOSE', config: MatSnackBarConfig = { duration: 5000 }) {
    this.snackBar.open(message, action, config);
  }

  showUndo(payload: any) {
    if (payload.sourceFolder) {
      const snackBarReference = this.snackBar.open(payload.message, 'Undo', { duration: 5000 });

      snackBarReference.onAction().subscribe(() => {
        this.store.dispatch(new UndoDeleteMail(payload));
      });
    } else {
      this.showSnackBar(payload.message);
    }
  }
}
