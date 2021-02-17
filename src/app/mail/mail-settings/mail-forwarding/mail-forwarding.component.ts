import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { VALID_EMAIL_REGEX } from '../../../shared/config';
import { SendEmailForwardingCode, SettingsUpdate, VerifyEmailForwardingCode } from '../../../store/actions';
import { AppState, Settings, UserState } from '../../../store/datatypes';

@UntilDestroy()
@Component({
  selector: 'app-mail-forwarding',
  templateUrl: './mail-forwarding.component.html',
  styleUrls: ['./mail-forwarding.component.scss', '../mail-settings.component.scss'],
})
export class MailForwardingComponent implements OnInit, OnDestroy {
  @ViewChild('addAddressModal') addAddressModal: any;

  @ViewChild('confirmDeleteAddressModal') confirmDeleteAddressModal: any;

  userState: UserState;

  settings: Settings;

  emailForm: FormGroup;

  codeForm: FormGroup;

  showFormErrorMessages: boolean;

  errorMessage: string;

  isVerificationCodeSent: boolean;

  isCodeFormSubmitted: boolean;

  private addAddressModalRef: NgbModalRef;

  private confirmDeleteAddressModalRef: NgbModalRef;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private modalService: NgbModal) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.isVerificationCodeSent = user.isForwardingVerificationCodeSent;
        this.errorMessage = user.emailForwardingErrorMessage;
        if (
          this.isCodeFormSubmitted &&
          this.userState.inProgress &&
          !user.inProgress &&
          !user.emailForwardingErrorMessage
        ) {
          this.addAddressModalRef.dismiss();
          this.isCodeFormSubmitted = false;
        }
        this.userState = user;
        this.settings = user.settings;
      });
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(VALID_EMAIL_REGEX)]],
    });
    this.codeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(VALID_EMAIL_REGEX)]],
      code: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {}

  onAddAddress() {
    this.showFormErrorMessages = false;
    this.isCodeFormSubmitted = false;
    this.isVerificationCodeSent = false;
    this.errorMessage = null;
    this.emailForm.reset();
    this.codeForm.reset();
    this.addAddressModalRef = this.modalService.open(this.addAddressModal, { centered: true, windowClass: 'modal-sm' });
  }

  onEditAddress() {
    this.onAddAddress();
    this.emailForm.get('email').setValue(this.settings.forwarding_address);
  }

  onDeleteAddress() {
    this.confirmDeleteAddressModalRef = this.modalService.open(this.confirmDeleteAddressModal, {
      centered: true,
      windowClass: 'modal-sm',
    });
  }

  onAddAddressSubmit() {
    this.showFormErrorMessages = true;
    if (this.emailForm.valid) {
      this.store.dispatch(new SendEmailForwardingCode({ email: this.emailForm.value.email }));
      this.showFormErrorMessages = false;
      this.codeForm.controls.email.setValue(this.emailForm.value.email);
    }
  }

  onVerifyCodeSubmit() {
    this.showFormErrorMessages = true;
    if (this.codeForm.valid) {
      this.store.dispatch(new VerifyEmailForwardingCode({ ...this.codeForm.value }));
      this.isCodeFormSubmitted = true;
      this.showFormErrorMessages = false;
    }
  }

  deleteAddress() {
    this.settings.enable_forwarding = false;
    this.settings.enable_copy_forwarding = false;
    this.settings.forwarding_address = '';
    this.store.dispatch(new SettingsUpdate(this.settings));
    this.confirmDeleteAddressModalRef.dismiss();
  }

  changeKeepCopy() {
    this.store.dispatch(new SettingsUpdate(this.settings));
  }
}
