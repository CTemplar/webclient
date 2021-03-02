import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NOT_FIRST_LOGIN, SYNC_DATA_WITH_STORE } from '../../../shared/config';

@Component({
  selector: 'app-use-cache-dialog',
  templateUrl: './use-cache-dialog.component.html',
  styleUrls: ['./use-cache-dialog.component.scss'],
})
export class UseCacheDialogComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onFlagSaveDecryptedSubject() {
    localStorage.setItem(SYNC_DATA_WITH_STORE, 'true');
    localStorage.setItem(NOT_FIRST_LOGIN, 'true');
    this.activeModal.dismiss();
  }

  onDismissSaveDecryptedSubject() {
    localStorage.setItem(NOT_FIRST_LOGIN, 'true');
    localStorage.setItem(SYNC_DATA_WITH_STORE, 'false');
    this.activeModal.dismiss();
  }
}
