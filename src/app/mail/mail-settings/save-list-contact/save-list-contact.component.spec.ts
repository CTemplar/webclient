import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore  } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SaveListContactComponent } from './save-list-contact.component';

describe('SaveListContactComponent', () => {
  let component: SaveListContactComponent;
  let fixture: ComponentFixture<SaveListContactComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [SaveListContactComponent],
      providers: [provideMockStore({})],
      imports: [MatSnackBarModule, FormsModule, ReactiveFormsModule],
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
