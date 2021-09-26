import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSignInComponent } from './users-sign-in.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import { LogIn } from '../../store/actions';
import { Store } from '@ngrx/store';
const initialState : any= {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
  inProgress: false,
  signupState: {
    username: null,
    password: null,
    recaptcha: null,
    currency: 'USD',
  },
  resetPasswordErrorMessage: null,
  isRecoveryCodeSent: false,
  captcha: {},
  auth2FA: {},
  saveDraftOnLogout: false,
  passwordChangeInProgress: false,
};

describe('UsersSignInComponent', () => {
  let component: UsersSignInComponent;
  let fixture: ComponentFixture<UsersSignInComponent>;

  let store: MockStore;

  const mockData = {
    username: 'superdev',
    password: 'P@ssw0rd',
    rememberMe: false,
  };

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignInComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore({initialState})],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignInComponent);
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
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let errors = {};
    let username = component.loginForm.controls['username'];
    expect(username.valid).toBeFalsy();

    // username field is required
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set username to something
    username.setValue("testuser@gmail.com");
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set email to something correct
    username.setValue(mockData.username);
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('password field validity', () => {
    let errors = {};
    let password = component.loginForm.controls['password'];

    // Email field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    password.setValue("123456");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    // Set email to something correct
    password.setValue(mockData.password);
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
});

  it('should dispatch Login action when login button is clicked', fakeAsync(() => {
    const loginButton = fixture?.debugElement?.query(By.css('#login-button'))?.nativeElement;
    loginButton?.click();
    component?.login(mockData, component.otp);    

    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['username'].setValue(mockData.username);
    component.loginForm.controls['password'].setValue(mockData.password);
    expect(component.loginForm.valid).toBeTruthy();

    const action = new LogIn(mockData);
    const dispatchSpy = spyOn(store, 'dispatch').withArgs(action).and.callThrough();
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  }));  
});
