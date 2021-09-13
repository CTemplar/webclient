import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { UsersSignUpComponent } from './users-sign-up.component';

describe('UsersSignUpComponent', () => {
  let component: UsersSignUpComponent;
  let fixture: ComponentFixture<UsersSignUpComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignUpComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
