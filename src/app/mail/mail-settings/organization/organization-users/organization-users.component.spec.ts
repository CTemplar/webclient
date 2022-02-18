import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationUsersComponent } from './organization-users.component';

describe('OrganizationUsersComponent', () => {
  let component: OrganizationUsersComponent;
  let fixture: ComponentFixture<OrganizationUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUsersComponent],
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
