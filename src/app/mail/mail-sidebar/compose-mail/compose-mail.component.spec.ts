import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeMailComponent } from './compose-mail.component';

describe('ComposeMailComponent', () => {
  let component: ComposeMailComponent;
  let fixture: ComponentFixture<ComposeMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposeMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
