import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

import {
  EmailCreateDomain,
  EmailReadDomain
} from '../../../store/actions';

import {
  AppState, AuthState,
  Settings,
  UserState,
  Domain,
  DomainRecord
} from '../../../store/datatypes';

@TakeUntilDestroy()
@Component({
  selector: 'app-custom-domains',
  templateUrl: './custom-domains.component.html',
  styleUrls: ['./custom-domains.component.scss']
})
export class CustomDomainsComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  
  userState: UserState;
  authState: AuthState;
  settings: Settings;
  domains: Domain[] = [];
  newDomain: Domain;
  newDomainError: string[];

  isAddingNewDomain = false;
  domainNameForm: FormGroup;
  verifyForm: FormGroup;
  mxForm: FormGroup;
  spfForm: FormGroup;
  dkimForm: FormGroup;
  dmarcForm: FormGroup;

  constructor(
    config: NgbDropdownConfig,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        this.authState = authState;
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.domains = user.emailDomains;
        this.newDomain = user.emailNewDomain;
        this.newDomainError = user.emailNewDomainError;
      });

    this.domainNameForm = this.formBuilder.group({
      domainNameCtrl: ['', Validators.required]
    });

    this.verifyForm = this.formBuilder.group({
    });

    this.mxForm = this.formBuilder.group({
    });

    this.spfForm = this.formBuilder.group({
    });

    this.dkimForm = this.formBuilder.group({
    });

    this.dmarcForm = this.formBuilder.group({
    });
  }

  ngOnDestroy(): void {
  }

  checkStatus(domainRecord: DomainRecord, is_verified: boolean): string {
    if (is_verified === true) {
      return 'verified';
    } else if (is_verified === false) {
      return 'failed';
    }
    return '';
  }

  createDomain() {
    const domain = this.domainNameForm.value.domainNameCtrl;
    if (domain !== ""){
      this.store.dispatch(new EmailCreateDomain(domain));
    }
  }

  readDomain(id: number) {
    if (id !== null) {
      this.store.dispatch(new EmailReadDomain(id));
    }
  }
}
