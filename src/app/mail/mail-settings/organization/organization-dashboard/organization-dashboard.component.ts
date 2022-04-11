import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { GetDomains, MoveTab } from '../../../../store/actions';
import { AppState, AuthState, Settings, UserState, Organization } from '../../../../store/datatypes';
import {
  AddOrganization,
  DeleteOrganization,
  GetOrganizations,
  UpdateOrganization,
} from '../../../../store/actions/organization.action';

@UntilDestroy()
@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./../../mail-settings.component.scss', './organization-dashboard.component.scss'],
})
export class OrganizationDashboardComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;

  private confirmModalRef: NgbModalRef;

  mode: 'view' | 'add' | 'edit' = 'view';

  selectedOrganization: any = null;

  userState: UserState;

  loading$: Observable<boolean>;

  authState: AuthState;

  settings: Settings;

  domainOptions: any[] = [];

  currentOrganizations: Organization[] = [];

  organizationOptions: any[] = [];

  constructor(
    config: NgbDropdownConfig,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
    this.store.dispatch(new GetOrganizations());
    this.store.dispatch(new GetDomains());

    this.loading$ = this.store.select(s => s.organization.inProgress);

    this.store
      .select(state => state.organization.selectedOrganization)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((organization: Organization) => {
        this.store.dispatch(new GetOrganizations());
        this.store.dispatch(new MoveTab(`organization/view/${organization.id}`));
      });

    combineLatest([
      this.store.select(state => state.organization.organizations),
      this.store.select(s => s.user),
      this.route.params,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([orgs, user, routeParameters]) => {
        this.mode = routeParameters.mode;
        this.userState = user;
        if (!user.inProgress) {
          this.settings = user.settings;

          this.currentOrganizations = orgs.map(o => ({
            ...o,
            custom_domain_name: user?.customDomains?.find(x => x.id === o.custom_domain)?.domain || null,
          }));

          this.domainOptions = user?.customDomains
            ?.filter(
              x => x.is_domain_verified && !this.currentOrganizations?.find(o => o.custom_domain_name === x.domain),
            )
            .map(x => ({ label: x.domain, value: x.id }));

          this.organizationOptions = this.currentOrganizations.map(o => ({ label: o.name, value: o }));
          const { orgId } = routeParameters;
          if (orgId) {
            this.selectedOrganization = this.currentOrganizations.find(o => +o.id === +orgId);
          }
        }
      });
  }

  onCreateOrganizationClick() {
    this.selectedOrganization = null;
    this.store.dispatch(new MoveTab('organization/add'));
  }

  onCancel() {
    this.store.dispatch(new MoveTab('organization/view'));
  }

  onSave(organization: Organization) {
    this.store.dispatch(new AddOrganization(organization));
  }

  onEdit(organization: Organization) {
    this.store.dispatch(new UpdateOrganization(this.selectedOrganization.id, organization));
  }

  onDelete() {
    this.openConfirmDeleteModal();
  }

  confirmDelete() {
    this.confirmModalRef?.close();
    this.store.dispatch(new MoveTab('organization/view'));
    this.store.dispatch(new DeleteOrganization(this.selectedOrganization.id));
  }

  gotoPricingPlans() {
    this.store.dispatch(new MoveTab('dashboard-and-plans'));
  }

  onChangeOrganization(organization: Organization) {
    this.selectedOrganization = organization;
    this.store.dispatch(new MoveTab(`organization/view/${organization.id}`));
  }

  openConfirmDeleteModal() {
    this.confirmModalRef = this.modalService.open(this.confirmDeleteModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
      backdrop: 'static',
    });
  }
}
