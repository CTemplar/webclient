import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { InviteCodesComponent } from './invite-codes.component';

describe('InviteCodesComponent', () => {
  let component: InviteCodesComponent;
  let fixture: ComponentFixture<InviteCodesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [InviteCodesComponent],
      providers: [provideMockStore({})],
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
