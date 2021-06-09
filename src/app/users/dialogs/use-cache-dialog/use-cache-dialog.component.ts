import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, Settings, UserState } from '../../../store/datatypes';
import { SYNC_DATA_WITH_STORE } from '../../../shared/config';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MailSettingsService } from '../../../store/services/mail-settings.service';

@UntilDestroy()
@Component({
  selector: 'app-use-cache-dialog',
  templateUrl: './use-cache-dialog.component.html',
  styleUrls: ['./use-cache-dialog.component.scss'],
})
export class UseCacheDialogComponent implements OnInit {
  askLocalCache = false;
  settings: Settings = new Settings();

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private settingsService: MailSettingsService,
  ) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.askLocalCache = user.settings.use_local_cache && user.settings.use_local_cache !== 'ASK';
        this.settings = user.settings;
      });
  }
  onFlagSaveDecryptedSubject() {
    this.saveAskLocalCach();
    localStorage.setItem(SYNC_DATA_WITH_STORE, 'true');
    this.activeModal.dismiss();
  }

  onDismissSaveDecryptedSubject() {
    this.saveAskLocalCach();
    localStorage.setItem(SYNC_DATA_WITH_STORE, 'false');
    this.activeModal.dismiss();
  }

  saveAskLocalCach() {
    let value = 'ASK';
    if (this.askLocalCache) {
      value = 'DISALLOWED';
    }
    this.settingsService.updateSettings(this.settings, 'use_local_cache', value);
  }
}
