import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersCreateAccountComponent } from './users-create-account.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

describe('UsersCreateAccountComponent', () => {
  let component: UsersCreateAccountComponent;
  let fixture: ComponentFixture<UsersCreateAccountComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersCreateAccountComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientModule, MatSnackBarModule, TranslateModule.forRoot()],
      providers: [provideMockStore({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
