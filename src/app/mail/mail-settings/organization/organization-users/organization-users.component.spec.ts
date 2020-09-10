import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUsersComponent } from './organization-users.component';

describe('OrganizationUsersComponent', () => {
  let component: OrganizationUsersComponent;
  let fixture: ComponentFixture<OrganizationUsersComponent>;

  beforeEach(async(() => {
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
