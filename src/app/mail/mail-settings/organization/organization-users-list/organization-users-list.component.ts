import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { Organization, OrgUser, AppState, OrgUserRequest } from '../../../../store/datatypes';
import { PasswordValidation } from '../../../../users/users-create-account/users-create-account.component';
import { OpenPgpService, UsersService } from '../../../../store/services';
import { SnackErrorPush } from '../../../../store/actions';
import { OrganizationState } from '../../../../store/reducers/organization.reducer';
import { AddOrgUser, DeleteOrgUser, UpdateOrgUser } from '../../../../store/actions/organization.action';

@UntilDestroy()
@Component({
  selector: 'app-organization-users-list',
  templateUrl: './organization-users-list.component.html',
  styleUrls: ['./organization-users-list.component.scss'],
})
export class OrganizationUsersListComponent {
  @Input() users: OrgUser[] = [];

  @Input() organization: Organization;

  @ViewChild('addUserModal') addUserModal: any;

  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;

  private addUserModalRef: NgbModalRef;

  private confirmDeleteModalRef: NgbModalRef;

  addUserForm: FormGroup;

  editUserForm: FormGroup;

  unmodifiedUsers: { [key: number]: OrgUser } = {};

  errorMessage: any;

  userExistError: string;

  organizationState: OrganizationState;

  newAddressOptions = { usernameExists: false, inProgress: false };

  isAddingUser: boolean;

  isAddingUserInProgress: boolean;

  userToDelete: OrgUser;

  private isDeleteInProgress: boolean;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
    private usersService: UsersService,
    private openPgpService: OpenPgpService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.addUserForm = this.formBuilder.group(
      {
        name: null,
        username: [
          null,
          [
            Validators.required,
            Validators.pattern(/^\w+([.-]?\w+)*$/),
            Validators.maxLength(64),
            Validators.minLength(4),
          ],
        ],
        password: [null, [Validators.required, Validators.maxLength(128)]],
        confirmPwd: [null, [Validators.required, Validators.maxLength(128)]],
        // recoveryEmail: [null, [Validators.pattern(VALID_EMAIL_REGEX)]],
        is_private: false,
        domain: this.organization?.custom_domain_name,
        storage: 104_857_600,
      },
      {
        validator: PasswordValidation.MatchPassword,
      },
    );

    this.store
      .select(state => state.organization)
      .pipe(untilDestroyed(this))
      .subscribe((organizationState: OrganizationState) => {
        this.organizationState = organizationState;
        if (this.isAddingUserInProgress && !this.organizationState.isAddingUserInProgress) {
          this.isAddingUserInProgress = false;
          if (this.organizationState.isError) {
            this.errorMessage = this.organizationState.error;
          } else {
            this.closeAddUserModal();
          }
        }
        if (this.isDeleteInProgress && !this.organizationState.isDeleteInProgress) {
          this.isDeleteInProgress = false;
          this.cancelDelete();
        }
      });

    this.handleUsernameAvailability();
  }

  openAddUserModal() {
    this.errorMessage = null;
    this.isAddingUser = true;
    this.addUserModalRef = this.modalService.open(this.addUserModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal org-user-add-modal',
      backdrop: 'static',
    });
    this.addUserModalRef.result.then(this.addUserModalClosed, this.addUserModalClosed);
  }

  addUserModalClosed() {
    this.addUserForm.reset();
    this.isAddingUserInProgress = false;
    this.isAddingUser = false;
    this.newAddressOptions = { usernameExists: false, inProgress: false };
  }

  closeAddUserModal() {
    this.addUserModalRef.close();
  }

  submitAddUser() {
    this.addUserForm.markAllAsTouched();
    this.errorMessage = null;
    if (this.addUserForm.invalid || this.newAddressOptions.usernameExists === true) {
      return;
    }
    this.isAddingUserInProgress = true;
    this.openPgpService.generateUserKeys(
      this.addUserForm.value.username,
      this.addUserForm.value.password,
      this.addUserForm.value.domain,
    );
    if (this.openPgpService.getUserKeys()) {
      this.addNewUser();
    } else {
      this.openPgpService.waitForPGPKeys(this, 'addNewUser', 'generateKeyFailed');
    }
  }

  addNewUser() {
    const user: any = {
      ...this.addUserForm.value,
      ...this.openPgpService.getUserKeys(),
      username: this.getEmail(),
    };
    const toSave: OrgUserRequest = {
      email: user.username,
      name: user.name,
      fingerprint: user.fingerprint,
      organisation: this.organization.id,
      password: user.password,
      public_key: user.public_key,
      private_key: user.private_key,
      is_private: user.is_private,
      role: user.role,
      storage: user.storage,
    };
    this.store.dispatch(new AddOrgUser(toSave));
  }

  generateKeyFailed() {
    this.isAddingUserInProgress = false;
    this.store.dispatch(new SnackErrorPush({ message: this.translate.instant('create_account.failed_generate_code') }));
  }

  startUpdatingUser(user: OrgUser) {
    this.unmodifiedUsers[user.id] = { ...user };
  }

  updateUser(user: OrgUser) {
    const toUpdate: OrgUserRequest = {
      name: user.name,
      storage: user.storage,
      is_private: user.is_private,
    } as OrgUserRequest;
    this.store.dispatch(new UpdateOrgUser(user.id, toUpdate, this.unmodifiedUsers[user.id]));
  }

  cancelUpdateUser(user: OrgUser) {
    const unmodifiedUser = this.unmodifiedUsers[user.id];
    user.name = unmodifiedUser.name;
    user.storage = unmodifiedUser.storage;
    user.is_private = unmodifiedUser.is_private;
  }

  openConfirmDeleteModal(user: OrgUser) {
    if (!this.organizationState.inProgress) {
      this.userToDelete = user;
      this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
        backdrop: 'static',
      });
    }
  }

  confirmDelete() {
    this.isDeleteInProgress = true;
    this.store.dispatch(new DeleteOrgUser(this.userToDelete));
  }

  cancelDelete() {
    this.userToDelete = null;
    this.confirmDeleteModalRef.close();
  }

  private getEmail() {
    return `${this.addUserForm.controls.username.value}@${this.addUserForm.controls.domain.value}`;
  }

  /**
   * Check username + domain can be used for new address
   */
  private handleUsernameAvailability() {
    this.addUserForm
      .get('username')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe(username => {
        this.userExistError = null;
        if (!username) {
          return;
        }
        if (!this.addUserForm.controls.username.errors) {
          this.newAddressOptions.inProgress = true;
          this.usersService.checkUsernameAvailability(this.getEmail()).subscribe(
            response => {
              this.newAddressOptions.usernameExists = response.exists;
              this.newAddressOptions.inProgress = false;
            },
            error => {
              this.userExistError = error.error;
              this.newAddressOptions.inProgress = false;
              this.newAddressOptions.usernameExists = null;
            },
          );
        }
      });
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  formatStorageLabel = (value: number) => value / (1024 * 1024);
}
