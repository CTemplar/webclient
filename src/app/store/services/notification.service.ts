import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AppState } from '../datatypes';
import { Store } from '@ngrx/store';
import { UndoDeleteMail } from '../actions';

@Injectable()
export class NotificationService {

  constructor(private snackBar: MatSnackBar,
              private store: Store<AppState>) {
  }

  showSnackBar(message: string, action: string = 'CLOSE', config: MatSnackBarConfig = { duration: 3000 }) {
    this.snackBar.open(message, action, config);
  }

  showUndo(payload: any) {
    if (payload.sourceFolder) {
      const snackBarRef = this.snackBar.open(payload.message, 'Undo', { duration: 5000 });

      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(new UndoDeleteMail(payload));
      });
    }

  }
}
