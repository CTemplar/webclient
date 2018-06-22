import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BlackListAdd, BlackListDelete, WhiteListAdd, WhiteListDelete } from '../../store/actions';
import { UserState } from '../../store/datatypes';
import { Observable } from 'rxjs/Observable';
import { selectUsersState } from '../../store/selectors';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {
  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially
  public getUsersState$: Observable<any>;
  public userState: UserState;
  private whiteListForm: FormGroup;
  private blackListForm: FormGroup;
  private showFormErrors: boolean = false;
  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store<UserState>,
    private formBuilder: FormBuilder
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
    this.getUsersState$ = this.store.select(selectUsersState);
  }

  ngOnInit() {
    this.updateUsersStatus();

    this.whiteListForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]]
    });
    this.blackListForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]]
    });
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  // == Methods related to ngbModal

  // == Open change password NgbModal
  changePasswordModalOpen(passwordContent) {
    this.modalService.open(passwordContent, {
      centered: true,
      windowClass: 'modal-md'
    });
  }

  // == Open add custom filter NgbModal
  addCustomFilterModalOpen(customFilterContent) {
    this.modalService.open(customFilterContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  // == Open add white list NgbModal
  whitelistModalOpen(whitelistContent) {
    this.modalService.open(whitelistContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  // == Open add black list NgbModal
  blacklistModalOpen(blacklistContent) {
    this.modalService.open(blacklistContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  // == Open billing information NgbModal
  billingInfoModalOpen(billingInfoContent) {
    this.modalService.open(billingInfoContent, {
      centered: true,
      windowClass: 'modal-lg'
    });
  }

  // == Open add new payment NgbModal
  newPaymentMethodModalOpen(newPaymentMethodContent) {
    this.modalService.open(newPaymentMethodContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  // == Open make a donation NgbModal
  makeDonationModalOpen(makeDonationContent) {
    this.modalService.open(makeDonationContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  private updateUsersStatus(): void {
    this.getUsersState$.subscribe((state: UserState) => {
      this.userState = state;
    });
  }

  private addWhitelist(whiteList) {
    this.showFormErrors = true;
    if (this.whiteListForm.valid) {
      this.store.dispatch(new WhiteListAdd(whiteList));
    }
  }

  private deleteWhiteList(id) {
    this.store.dispatch(new WhiteListDelete(id));
    this.updateUsersStatus();
  }

  private addBlacklist(blackList) {
    this.showFormErrors = true;
    if (this.blackListForm.valid) {
      this.store.dispatch(new BlackListAdd(blackList));
    }
  }

  private deleteBlackList(id) {
    this.store.dispatch(new BlackListDelete(id));
    this.updateUsersStatus();
  }
}
