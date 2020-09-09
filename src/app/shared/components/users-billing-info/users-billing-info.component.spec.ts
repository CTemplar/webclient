import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBillingInfoComponent } from './users-billing-info.component';

describe('UsersBillingInfoComponent', () => {
  let component: UsersBillingInfoComponent;
  let fixture: ComponentFixture<UsersBillingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersBillingInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersBillingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
