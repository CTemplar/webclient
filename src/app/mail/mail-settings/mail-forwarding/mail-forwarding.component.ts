import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { VALID_EMAIL_REGEX } from '../../../shared/config';
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

  @ViewChild('addAddressModal') addAddressModal;

  userState: UserState;
  settings: Settings;
  addAddressForm: FormGroup;
  isFormSubmitted: boolean;

  private addAddressModalRef: NgbModalRef;

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
    this.addAddressForm = this.formBuilder.group({
      address: ['', [Validators.required, Validators.pattern(VALID_EMAIL_REGEX)]]
    });
  }

  ngOnDestroy(): void {
  }

  onAddAddress() {
    this.isFormSubmitted = false;
    this.addAddressForm.reset();
    this.addAddressModalRef = this.modalService.open(this.addAddressModal, { centered: true, windowClass: 'modal-sm' });
  }

  onEditAddress() {
    this.onAddAddress();
    this.addAddressForm.get('address').setValue(this.settings.forwarding_address);
  }

  confirmDeleteAddress() {

  }

  onAddAddressSubmit() {
    this.isFormSubmitted = true;
    if (this.addAddressForm.valid) {
      this.settings.enable_forwarding = true;
      this.settings.forwarding_address = this.addAddressForm.value.address;
      this.store.dispatch(new SettingsUpdate(this.settings));
      this.addAddressModalRef.dismiss();
    }
  }
}
