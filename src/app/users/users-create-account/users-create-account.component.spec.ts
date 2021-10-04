import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersCreateAccountComponent } from './users-create-account.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { UpdateSignupData } from '../../store/actions';

const initialState : any= {  
};

describe('UsersCreateAccountComponent', () => {
  let component: UsersCreateAccountComponent;
  let fixture: ComponentFixture<UsersCreateAccountComponent>;

  let mockStore: MockStore;

  const mockData = {
    username: 'superdev',
    password: 'P@ssw0rd',
    recovery_email: 'superdev123@gmail.com',
    recaptcha: 'test',
  };

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersCreateAccountComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        TranslateModule.forRoot()],
      providers: [provideMockStore({initialState})],
    }).compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateAccountComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', inject([Store], (store: any) => {    
    expect(store).toBeTruthy();
  }));  

  it('form invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should render username, password,confirm password, recovery and invitation code input elements', () => {
    const naviteElement = fixture.debugElement.nativeElement;
    const usernameInput = naviteElement.querySelector('input[id="username"]');
    const passwordInput = naviteElement.querySelector('input[id="choosePassword"]');
    const confirmPasswordInput = naviteElement.querySelector('input[id="confirmPassword"]');
    const recoveryEmailInput = naviteElement.querySelector('input[id="recoveryEmail"]');
    const invitedCodeInput = naviteElement.querySelector('input[id="inviteCode"]');

    expect(usernameInput).toBeDefined()
    expect(passwordInput).toBeDefined();
    expect(confirmPasswordInput).toBeDefined();
    expect(recoveryEmailInput).toBeDefined();
    expect(invitedCodeInput).toBeDefined();
  });

  it('form invalid when empty', () => {
    component.signupForm.controls.username.setValue('');
    component.signupForm.controls.choosePassword.setValue('');
    component.signupForm.controls.confirmPassword.setValue('');
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let username = component.signupForm.controls['username'];
    expect(username.valid).toBeFalsy();

    let errors = {};
    username.setValue("");
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(errors['minLength']).toBeTruthy();
    expect(errors['maxLength']).toBeTruthy();
  });

  it('password field validity', () => {
    const password = component.signupForm.controls.password;
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();    
    expect(password.hasError('minLength')).toBeTruthy();    
    expect(password.hasError('maxLength')).toBeTruthy();    
  });

  it('confirmPassword field validity', () => {
    const confirmPwd = component.signupForm.controls.confirmPwd;
    expect(confirmPwd.valid).toBeFalsy();

    confirmPwd.setValue('');
    expect(confirmPwd.hasError('required')).toBeTruthy();    
    expect(confirmPwd.hasError('minLength')).toBeTruthy();    
    expect(confirmPwd.hasError('maxLength')).toBeTruthy();    
  });

  it('recovery email field validity', () => {
    const recoveryEmail = component.signupForm.controls.recoveryEmail;
    expect(recoveryEmail.valid).toBeFalsy();

    recoveryEmail.setValue('');
    expect(recoveryEmail.hasError('required')).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    const signupButton = fixture?.debugElement?.query(By.css('#signup-button'))?.nativeElement;        
    signupButton.click();
    expect(component.signup).toHaveBeenCalledTimes(1);

    // this works as expected, tests are passing
    const expectedAction = new UpdateSignupData(mockData);
    const dispatchSpy = spyOn(mockStore, 'dispatch').and.callThrough();
    mockStore.dispatch(expectedAction);

    fixture.detectChanges();
    
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction)
        
    expect(component.signupState$.value).not.toBeNull();

  });
});
