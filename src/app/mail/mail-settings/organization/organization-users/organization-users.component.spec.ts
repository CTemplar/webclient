import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrganizationUsersComponent } from './organization-users.component';

describe('OrganizationUsersComponent', () => {
  let component: OrganizationUsersComponent;
  let fixture: ComponentFixture<OrganizationUsersComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUsersComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
