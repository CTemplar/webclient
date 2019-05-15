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
import { UsersService } from '../../../../store/services';

@TakeUntilDestroy()
@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss']
})
export class OrganizationUsersComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  @ViewChild('addUserModal') addUserModal;

  users: OrganizationUser[] = [
    { username: 'atif@aretesol.com', domain: 'aretesol.com' },
    { username: 'nitish@aretesol.com', domain: 'aretesol.com' }
  ];
  addUserForm: FormGroup;
  errorMessage: any;
  submitted: boolean;
  orgUserState: any = {};
  customDomains: string[];
  newAddressOptions = { usernameExists: false, inProgress: false };
  isAddingUserInProgress: boolean;

  private addUserModalRef: NgbModalRef;


  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private usersService: UsersService,
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
        this.customDomains = user.customDomains.filter((item) => item.is_domain_verified && item.is_mx_verified)
          .map((item) => item.domain);
        if (this.customDomains.length > 0) {
          this.addUserForm.get('domain').setValue(this.customDomains[0]);
        }
      });
    this.handleUsernameAvailability();
  }

  openAddUserModal() {
    this.isAddingUserInProgress = true;
    this.addUserModalRef = this.modalService.open(this.addUserModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal org-user-add-modal',
      backdrop: 'static',
    });
    this.addUserModalRef.result.then((result) => {
      this.addUserForm.reset();
      this.isAddingUserInProgress = false;
    }, (reason) => {
      this.addUserForm.reset();
      this.isAddingUserInProgress = false;
    });
  }

  closeAddUserModal() {
    this.addUserForm.reset();
    this.addUserModalRef.close();
  }

  submitAddUser() {
    this.submitted = true;
    if (this.addUserForm.invalid || this.newAddressOptions.usernameExists === true) {
      return false;
    }
    console.log(this.addUserForm.value);
    const user = new OrganizationUser(this.addUserForm.value);
    this.closeAddUserModal();
  }

  private getEmail() {
    return this.addUserForm.controls['username'].value + '@' + this.addUserForm.controls['domain'].value;
  }


  private handleUsernameAvailability() {
    this.addUserForm.get('username').valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroyed$)
      )
      .subscribe((username) => {
        this.errorMessage = '';
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
                this.errorMessage = error.error;
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
