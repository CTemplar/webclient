import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecryptComponent } from './decrypt.component';

describe('DecryptComponent', () => {
  let component: DecryptComponent;
  let fixture: ComponentFixture<DecryptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecryptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecryptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
