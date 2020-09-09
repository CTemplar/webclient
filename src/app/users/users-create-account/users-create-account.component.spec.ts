import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreateAccountComponent } from './users-create-account.component';

describe('UsersCreateAccountComponent', () => {
  let component: UsersCreateAccountComponent;
  let fixture: ComponentFixture<UsersCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersCreateAccountComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
