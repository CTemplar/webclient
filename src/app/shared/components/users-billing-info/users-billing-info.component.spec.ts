import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UsersBillingInfoComponent } from './users-billing-info.component';

describe('UsersBillingInfoComponent', () => {
  let component: UsersBillingInfoComponent;
  let fixture: ComponentFixture<UsersBillingInfoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersBillingInfoComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, MatSnackBarModule],
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
