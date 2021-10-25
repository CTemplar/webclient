import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSignInComponent } from './users-sign-in.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UsersSignInComponent', () => {
  let component: UsersSignInComponent;
  let fixture: ComponentFixture<UsersSignInComponent>;
  
  let store: MockStore;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignInComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, RouterTestingModule],
      providers: [provideMockStore({
        initialState: {
          auth: {
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
          },
        }
      })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function updateForm(username: string, password: string, rememberMe: boolean) {
    component.loginForm.controls['username'].setValue(username);
    component.loginForm.controls['password'].setValue(password);
    component.loginForm.controls['rememberMe'].setValue(rememberMe);
  }

  // Isolated Test
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.showFormErrors).toBeFalsy();
    expect(component.isConfirmedPrivacy).toBeUndefined;
    expect(component.username).toEqual('');
    expect(component.password).toEqual('password');
    expect(component.layout).toEqual('alphanumeric');
    expect(component.isLoading).toBeFalsy();
  });
});
