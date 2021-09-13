import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAccountInitDialogComponent } from './user-account-init-dialog.component';

describe('UserAccountInitDialogComponent', () => {
  let component: UserAccountInitDialogComponent;
  let fixture: ComponentFixture<UserAccountInitDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UserAccountInitDialogComponent],
      imports: [NgbActiveModal]
    }).compileComponents();
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
