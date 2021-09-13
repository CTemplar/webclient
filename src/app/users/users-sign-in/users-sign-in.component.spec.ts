import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSignInComponent } from './users-sign-in.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UsersSignInComponent', () => {
  let component: UsersSignInComponent;
  let fixture: ComponentFixture<UsersSignInComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignInComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, RouterTestingModule],
      providers: [provideMockStore({})]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
