import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { SettingsUpdate } from '../../../store/actions';
import { AppState, Settings, UserState } from '../../../store/datatypes';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-forwarding',
  templateUrl: './mail-forwarding.component.html',
  styleUrls: ['./mail-forwarding.component.scss', '../mail-settings.component.scss']
})
export class MailForwardingComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  userState: UserState;
  settings: Settings;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
      });
  }

  ngOnDestroy(): void {
  }

  updateSettings(key?: string, value?: any) {
    if (key) {
      if (this.settings[key] !== value) {
        this.settings[key] = value;
        this.store.dispatch(new SettingsUpdate(this.settings));
      }
    } else {
      this.store.dispatch(new SettingsUpdate(this.settings));
    }
  }

  onEditAddress() {

  }

  confirmDeleteAddress() {

  }

  onAddAddress() {

  }
}
