import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { MailSettingsService } from '../../../store/services/mail-settings.service';
import { ChangePassword } from '../../../store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpenPgpService } from '../../../store/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PasswordValidation } from '../../../users/users-create-account/users-create-account.component';

@TakeUntilDestroy()
@Component({
  selector: 'app-settings-security',
  templateUrl: './security.component.html',
  styleUrls: ['./../mail-settings.component.scss', './security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  private changePasswordModalRef: NgbModalRef;
  @ViewChild('changePasswordModal') changePasswordModal;

  settings: any;
  changePasswordForm: FormGroup;
  showChangePasswordFormErrors = false;
  userState: UserState;
  inProgress: boolean;
  isEncryptingMessages: boolean = false;

  constructor(private store: Store<AppState>,
              private settingsService: MailSettingsService,
              private modalService: NgbModal,
              private openPgpService: OpenPgpService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
      });


    this.changePasswordForm = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  updateSettings(key?: string, value?: any) {
    this.settingsService.updateSettings(this.settings, key, value);
  }


  // == Open change password NgbModal
  openChangePasswordModal() {
    this.showChangePasswordFormErrors = false;
    this.changePasswordForm.reset();
    this.changePasswordModalRef = this.modalService.open(this.changePasswordModal, {
      centered: true,
      windowClass: 'modal-md'
    });
  }

  changePassword() {
    this.showChangePasswordFormErrors = true;
    if (this.changePasswordForm.valid) {
      this.inProgress = true;
      this.openPgpService.generateUserKeys(this.userState.username, this.changePasswordForm.value.password);
      if (this.openPgpService.getUserKeys()) {
        this.changePasswordConfirmed();
      } else {
        this.openPgpService.waitForPGPKeys(this, 'changePasswordConfirmed');
      }
    }
  }

  changePasswordConfirmed() {
    const data = this.changePasswordForm.value;
    const requestData = {
      username: this.userState.username,
      old_password: data.oldPassword,
      password: data.password,
      confirm_password: data.confirmPwd,
      ...this.openPgpService.getUserKeys()
    };
    this.store.dispatch(new ChangePassword(requestData));
    this.changePasswordModalRef.dismiss();
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  ngOnDestroy(): void {
  }
}
