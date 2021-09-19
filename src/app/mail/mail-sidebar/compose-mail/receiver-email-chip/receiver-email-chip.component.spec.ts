import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReceiverEmailChipComponent } from './receiver-email-chip.component';
import { NgbNavModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { EmailFormatPipe } from '../../../../shared/pipes/email-formatting.pipe';

describe('ReceiverEmailChipComponent', () => {
  let component: ReceiverEmailChipComponent;
  let fixture: ComponentFixture<ReceiverEmailChipComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [NgbPopover, EmailFormatPipe, ReceiverEmailChipComponent],
      providers: [provideMockStore({}), NgbPopover, EmailFormatPipe],
      imports: [HttpClientModule, MatSnackBarModule, NgbNavModule],
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
