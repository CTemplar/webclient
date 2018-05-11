import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnscreenKeyboardComponent } from './onscreen-keyboard.component';

describe('OnscreenKeyboardComponent', () => {
  let component: OnscreenKeyboardComponent;
  let fixture: ComponentFixture<OnscreenKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnscreenKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnscreenKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
