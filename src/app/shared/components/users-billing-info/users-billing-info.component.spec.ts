import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenPgpService } from '../../../store/services';
import { UsersBillingInfoComponent } from './users-billing-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UsersBillingInfoComponent', () => {
  let component: UsersBillingInfoComponent;
  let fixture: ComponentFixture<UsersBillingInfoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersBillingInfoComponent],
      providers: [provideMockStore({}), OpenPgpService],
      imports: [HttpClientModule, MatSnackBarModule, RouterTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
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
