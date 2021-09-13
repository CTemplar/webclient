import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReceiverEmailChipComponent } from './receiver-email-chip.component';
import { NgbNavModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

describe('ReceiverEmailChipComponent', () => {
  let component: ReceiverEmailChipComponent;
  let fixture: ComponentFixture<ReceiverEmailChipComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ReceiverEmailChipComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, MatSnackBarModule, NgbNavModule, NgbPopover],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverEmailChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
