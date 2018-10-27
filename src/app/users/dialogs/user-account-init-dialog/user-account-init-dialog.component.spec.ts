import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountInitDialogComponent } from './user-account-init-dialog.component';

describe('UserAccountInitDialogComponent', () => {
  let component: UserAccountInitDialogComponent;
  let fixture: ComponentFixture<UserAccountInitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountInitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountInitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
