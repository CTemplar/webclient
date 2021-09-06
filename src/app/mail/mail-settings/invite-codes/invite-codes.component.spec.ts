import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore  } from '@ngrx/store/testing';

import { InviteCodesComponent } from './invite-codes.component';

describe('InviteCodesComponent', () => {
  let component: InviteCodesComponent;
  let fixture: ComponentFixture<InviteCodesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [InviteCodesComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, MatSnackBarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
