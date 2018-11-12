import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinFormComponent } from './bitcoin-form.component';

describe('BitcoinFormComponent', () => {
  let component: BitcoinFormComponent;
  let fixture: ComponentFixture<BitcoinFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitcoinFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitcoinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
