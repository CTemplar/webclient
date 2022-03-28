import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveContactComponent } from './save-contact.component';

describe('SaveContactComponent', () => {
  let component: SaveContactComponent;
  let fixture: ComponentFixture<SaveContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SaveContactComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
