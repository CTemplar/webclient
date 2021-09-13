import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UseCacheDialogComponent } from './use-cache-dialog.component';

describe('UseCacheDialogComponent', () => {
  let component: UseCacheDialogComponent;
  let fixture: ComponentFixture<UseCacheDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UseCacheDialogComponent],
      imports: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCacheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
