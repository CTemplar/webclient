import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CreateDomain, DeleteDomain, GetDomains, UpdateDomain, VerifyDomain } from '../../../store/actions';
import { AppState, AuthState, Domain, Settings, UserState, MailBoxesState } from '../../../store/datatypes';
import { SharedService } from '../../../store/services';
import { PRIMARY_WEBSITE } from '../../../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-custom-domains',
  templateUrl: './custom-domains.component.html',
  styleUrls: ['./custom-domains.component.scss'],
})
export class CustomDomainsComponent implements OnInit, OnDestroy {
  @Output() onGotoTab = new EventEmitter<string>();

  @ViewChild('confirmDeleteModal') confirmDeleteModal;

  userState: UserState;

  authState: AuthState;

  settings: Settings;

  mailboxes: Array<any>;

  domains: Domain[] = [];

  newDomain: Domain;

  newDomainError: string;

  isAddingNewDomain = false;

  currentStep = 0;

  domainNameForm: FormGroup;

  verifyForm: FormGroup;

  mxForm: FormGroup;

  spfForm: FormGroup;

  dkimForm: FormGroup;

  dmarcForm: FormGroup;

  isEditing: boolean;

  mailboxesForCustomDomains: Map<number, Array<string>> = new Map();

  primaryWebsite = PRIMARY_WEBSITE;

  private confirmModalRef: NgbModalRef;

  constructor(
    config: NgbDropdownConfig,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.authState = authState;
      });

    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        if (!user.inProgress) {
          this.settings = user.settings;
          this.domains = user.customDomains;
          this.newDomain = user.newCustomDomain;
          this.newDomainError = user.newCustomDomainError;
          this.currentStep = user.currentCreationStep;
          this.prepareMapForDomainAlias(this.domains, this.mailboxes);
        }
      });

    this.domainNameForm = this.formBuilder.group({
      domainNameCtrl: ['', Validators.required],
    });

    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailboxesState: MailBoxesState) => {
        this.mailboxes = mailboxesState.mailboxes;
        this.prepareMapForDomainAlias(this.domains, this.mailboxes);
      });

    this.verifyForm = this.formBuilder.group({});
    this.mxForm = this.formBuilder.group({});
    this.spfForm = this.formBuilder.group({});
    this.dkimForm = this.formBuilder.group({});
    this.dmarcForm = this.formBuilder.group({});
  }

  ngOnDestroy(): void {}

  prepareMapForDomainAlias(domains: Domain[], aliases: Array<any>) {
    if (domains && aliases) {
      domains.forEach((domain, indexDomain) => {
        let aliasesForDomain = [];
        aliases.forEach(alias => {
          const domainForAlias = alias.email.split('@')[1];
          if (domain.domain === domainForAlias && alias.is_enabled) {
            aliasesForDomain.push(alias.email);
            if (!domain.catch_all_email && aliasesForDomain.length === 1) {
              domain.catch_all_email = alias.email;
              this.domains[indexDomain] = domain;
            }
          }
        });
        this.mailboxesForCustomDomains.set(domain.id, aliasesForDomain);
      });
    }
  }

  startAddingNewDomain(domain: any = null) {
    this.newDomainError = null;
    if (domain) {
      this.currentStep = 1;
      this.isEditing = true;
      this.newDomain = domain;
      this.isAddingNewDomain = true;
    } else if (!this.userState.inProgress) {
      this.currentStep = 0;
      domain = {};
      this.newDomain = domain;
      this.isAddingNewDomain = true;
      this.isEditing = false;
    }
  }

  createDomain() {
    const domain = this.domainNameForm.value.domainNameCtrl;
    if (domain !== '') {
      this.store.dispatch(new CreateDomain(domain));
    }
  }

  copyToClipboard(text: string) {
    this.sharedService.copyToClipboard(text);
  }

  verifyDomain(id: number, gotoNextStep = false, reverify = false) {
    if (id !== null) {
      this.store.dispatch(new VerifyDomain({ id, gotoNextStep, reverify, currentStep: this.currentStep }));
    }
  }

  updateDomain(domain: Domain) {
    this.store.dispatch(new UpdateDomain(domain));
  }

  onSelectCatchAllEmail(domain: Domain, email: string) {
    if (domain.catch_all_email !== email) {
      domain.catch_all_email = email;
      this.updateDomain(domain);
    }
  }

  finishAddingNewDomain() {
    this.isAddingNewDomain = false;
    this.currentStep = 0;
    this.newDomain = null;
    this.domainNameForm.setValue({ domainNameCtrl: '' });
    this.store.dispatch(new GetDomains());
  }

  openConfirmDeleteModal(domain: Domain) {
    if (!this.userState.inProgress) {
      this.newDomain = domain;
      this.confirmModalRef = this.modalService.open(this.confirmDeleteModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
        backdrop: 'static',
      });
    }
  }

  cancelDelete() {
    this.confirmModalRef.close();
  }

  deleteDomain() {
    this.confirmModalRef.close();
    this.store.dispatch(new DeleteDomain(this.newDomain.id));
  }

  gotoPricingPlans() {
    this.onGotoTab.emit('dashboard-plans');
  }
}
