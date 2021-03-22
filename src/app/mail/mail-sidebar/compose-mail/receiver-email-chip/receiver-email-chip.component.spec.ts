import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverEmailChipComponent } from './receiver-email-chip.component';

describe('ReceiverEmailChipComponent', () => {
  let component: ReceiverEmailChipComponent;
  let fixture: ComponentFixture<ReceiverEmailChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverEmailChipComponent ]
    })
    .compileComponents();
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
