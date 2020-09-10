import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveListContactComponent } from './save-list-contact.component';

describe('SaveListContactComponent', () => {
  let component: SaveListContactComponent;
  let fixture: ComponentFixture<SaveListContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveListContactComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveListContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
