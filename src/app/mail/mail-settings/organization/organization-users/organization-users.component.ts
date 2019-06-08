import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationUser } from '../../../../store/models';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/internal/Observable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VALID_EMAIL_REGEX } from '../../../../shared/config';
import { PasswordValidation } from '../../../../users/users-create-account/users-create-account.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AppState, UserState } from '../../../../store/datatypes';
import { Store } from '@ngrx/store';
import { OpenPgpService, UsersService } from '../../../../store/services';
import {
  AddOrganizationUser,
  DeleteOrganizationUser,
  GetOrganizationUsers,
  OrganizationState,
  UpdateOrganizationUser
} from '../../../../store/organization.store';

@TakeUntilDestroy()
@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss']
})
export class OrganizationUsersComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  @ViewChild('addUserModal', { static: false }) addUserModal;
  @ViewChild('confirmDeleteModal', { static: false }) confirmDeleteModal;

  users: OrganizationUser[];
  addUserForm: FormGroup;
  errorMessage: any;
  userExistError: string;
  submitted: boolean;
  organizationState: OrganizationState;
  customDomains: string[];
  newAddressOptions = { usernameExists: false, inProgress: false };
  isAddingUser: boolean;
  isAddingUserInProgress: boolean;
  userState: UserState;
  selectedUser: OrganizationUser;

  private addUserModalRef: NgbModalRef;
  private confirmDeleteModalRef: NgbModalRef;
  private isDeleteInProgress: boolean;


  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private usersService: UsersService,
              private openPgpService: OpenPgpService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-z]+([a-z0-9]*[._-]?[a-z0-9]+)+$/i),
        Validators.maxLength(128),
        Validators.minLength(2),
      ]],
      domain: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      confirmPwd: ['', [Validators.required, Validators.maxLength(128)]],
      recoveryEmail: ['', [Validators.pattern(VALID_EMAIL_REGEX)]]
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.customDomains = user.customDomains.filter((item) => item.is_domain_verified && item.is_mx_verified)
          .map((item) => item.domain);
        if (this.customDomains.length > 0) {
          this.addUserForm.get('domain').setValue(this.customDomains[0]);
        }
      });

    this.store.select(state => state.organization).pipe(takeUntil(this.destroyed$))
      .subscribe((organizationState: OrganizationState) => {
        this.organizationState = organizationState;
        this.users = organizationState.users;
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
    this.addUserForm.get('domain').setValue(this.customDomains[0]);
    this.addUserModalRef = this.modalService.open(this.addUserModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal org-user-add-modal',
      backdrop: 'static',
    });
    this.addUserModalRef.result.then((result) => {
      this.addUserModalClosed();
    }, (reason) => {
      this.addUserModalClosed();
    });
  }

  addUserModalClosed() {
    this.addUserForm.reset();
    this.isAddingUserInProgress = false;
    this.isAddingUser = false;
    this.newAddressOptions = { usernameExists: false, inProgress: false };
    this.submitted = false;
  }

  closeAddUserModal() {
    this.addUserModalRef.close();
  }

  submitAddUser() {
    this.submitted = true;
    this.errorMessage = null;
    if (this.addUserForm.invalid || this.newAddressOptions.usernameExists === true) {
      return false;
    }

    this.isAddingUserInProgress = true;
    this.openPgpService.generateUserKeys(this.addUserForm.value.username, this.addUserForm.value.password, this.addUserForm.value.domain);
    if (this.openPgpService.getUserKeys()) {
      this.addNewUser();
    } else {
      this.openPgpService.waitForPGPKeys(this, 'addNewUser');
    }
  }

  addNewUser() {
    const user = new OrganizationUser({ ...this.addUserForm.value, ...this.openPgpService.getUserKeys(), username: this.getEmail() });
    this.store.dispatch(new AddOrganizationUser(user));
  }

  startUpdatingUser(user: OrganizationUser) {
    user.unmodifiedUser = new OrganizationUser(user);
  }

  updateUser(user: OrganizationUser) {
    this.store.dispatch(new UpdateOrganizationUser(user));
  }

  openConfirmDeleteModal(user: OrganizationUser) {
    if (!this.organizationState.inProgress) {
      this.selectedUser = user;
      this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
        backdrop: 'static'
      });
    }
  }

  confirmDelete() {
    this.isDeleteInProgress = true;
    this.store.dispatch(new DeleteOrganizationUser(this.selectedUser));
  }

  cancelDelete() {
    this.selectedUser = null;
    this.confirmDeleteModalRef.close();
  }

  private getEmail() {
    return this.addUserForm.controls['username'].value + '@' + this.addUserForm.controls['domain'].value;
  }


  private handleUsernameAvailability() {
    this.addUserForm.get('username').valueChanges
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroyed$)
      )
      .subscribe((username) => {
        this.userExistError = null;
        if (!username) {
          return;
        }
        if (!this.addUserForm.controls['username'].errors) {
          this.newAddressOptions.inProgress = true;
          this.usersService.checkUsernameAvailability(this.getEmail())
            .subscribe(response => {
                this.newAddressOptions.usernameExists = response.exists;
                this.newAddressOptions.inProgress = false;
              },
              error => {
                this.userExistError = error.error;
                this.newAddressOptions.inProgress = false;
                this.newAddressOptions.usernameExists = null;
              });
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

  ngOnDestroy(): void {
  }

}
