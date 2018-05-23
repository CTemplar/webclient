import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureMessageComponent } from './secure-message.component';

describe('SecureMessageComponent', () => {
  let component: SecureMessageComponent;
  let fixture: ComponentFixture<SecureMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
