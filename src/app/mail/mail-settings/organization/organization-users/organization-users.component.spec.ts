import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { OrganizationUsersComponent } from './organization-users.component';

describe('OrganizationUsersComponent', () => {
  let component: OrganizationUsersComponent;
  let fixture: ComponentFixture<OrganizationUsersComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUsersComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule],
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
