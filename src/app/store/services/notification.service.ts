import { Injectable, Component } from '@angular/core';
import { ToastrService,  ToastPackage, Toast  } from 'ngx-toastr';
import {MatSnackBar} from '@angular/material';
import { AppState } from '../datatypes';
import { Store } from '@ngrx/store';
import { UndoDeleteMail } from '../actions';

@Injectable()
export class NotificationService {

  constructor(private toastr: ToastrService,
              private snackBar: MatSnackBar,
              private store: Store<AppState>) {
  }

  showSuccess(message: string, title?: string) {
    this.toastr.success(message,  title, );
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title);
  }


  showUndo(payload: any) {
    if (payload.sourceFolder) {
      const snackBarRef = this.snackBar.open(payload.message, 'Undo');

      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(new UndoDeleteMail(payload));
      });
    }

  }
}
