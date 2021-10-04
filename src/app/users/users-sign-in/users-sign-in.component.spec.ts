import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSignInComponent } from './users-sign-in.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LogIn, LogInFailure, LogInSuccess } from '../../store/actions';
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

  let mockStore: MockStore;

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
      providers: [
        provideMockStore({initialState})
      ],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
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

  it('should render username and password input elements', () => {
    const naviteElement = fixture.debugElement.nativeElement;
    const usernameInput = naviteElement.querySelector('input[id="username_noSpan"]');
    const passwordInput = naviteElement.querySelector('input[id="password_noSpan"]');

    expect(usernameInput).toBeDefined()
    expect(passwordInput).toBeDefined();    
  });

  it('should test login form validity', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();

    const usernameInput = form.controls.username;
    usernameInput.setValue(mockData.username);

    const passwordInput = form.controls.password;
    passwordInput.setValue(mockData.password);

    expect(form.valid).toBeTruthy();
  })

  it('should test input validity', () => {
    const usernameInput = component.loginForm.controls.username;
    const passwordInput = component.loginForm.controls.password;

    expect(usernameInput.valid).toBeFalsy();
    expect(passwordInput.valid).toBeFalsy();

    usernameInput.setValue(mockData.username);
    expect(usernameInput.valid).toBeTruthy();

    passwordInput.setValue(mockData.password);
    expect(passwordInput.valid).toBeTruthy();
  })
  
  it('should test input errors', () => {
    const usernameInput = component.loginForm.controls.username;
    expect(usernameInput.errors.required).toBeTruthy();

    usernameInput.setValue(mockData.username);
    expect(usernameInput.errors).toBeNull();
  });

  it('should dispatch Login action when login button is clicked', fakeAsync(() => {
    const loginButton = fixture?.debugElement?.query(By.css('#login-button'))?.nativeElement;
    loginButton?.click();
    // component?.login(mockData, component.otp);    
    expect(component.login).toHaveBeenCalledTimes(1)
            
    // this works as expected, tests are passing
    const expectedAction = new LogIn(mockData);
    const dispatchSpy = spyOn(mockStore, 'dispatch').and.callThrough();
    mockStore.dispatch(expectedAction);

    //Act
    fixture.detectChanges();
    
    //Assert
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction)

    // Act - test success
    mockStore.dispatch(new LogInSuccess([]));
    fixture.detectChanges();

    // Act - test failure
    mockStore.dispatch(new LogInFailure([]));
    fixture.detectChanges();
        
    // Assert
    expect(component.authState).not.toBeNull();
  }));  
});
