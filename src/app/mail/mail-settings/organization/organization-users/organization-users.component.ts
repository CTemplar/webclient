import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationUser } from '../../../../store/models';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/internal/Observable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PRIMARY_DOMAIN, VALID_EMAIL_REGEX } from '../../../../shared/config';
import { PasswordValidation } from '../../../../users/users-create-account/users-create-account.component';
import { takeUntil } from 'rxjs/operators';
import { AppState, UserState } from '../../../../store/datatypes';
import { Store } from '@ngrx/store';

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

  private addUserModalRef: NgbModalRef;


  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
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
  }

  openAddUserModal() {
    this.addUserModalRef = this.modalService.open(this.addUserModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  closeAddUserModal() {
    this.addUserModalRef.dismiss();
  }

  submitAddUser() {
    this.submitted = true;
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
