import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSignUpComponent } from './users-sign-up.component';

describe('UsersSignUpComponent', () => {
  let component: UsersSignUpComponent;
  let fixture: ComponentFixture<UsersSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignUpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
