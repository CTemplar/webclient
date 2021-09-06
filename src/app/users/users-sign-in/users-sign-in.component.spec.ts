import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSignInComponent } from './users-sign-in.component';

describe('UsersSignInComponent', () => {
  let component: UsersSignInComponent;
  let fixture: ComponentFixture<UsersSignInComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignInComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
