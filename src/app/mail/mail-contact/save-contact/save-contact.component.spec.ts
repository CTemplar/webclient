import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { provideMockStore  } from '@ngrx/store/testing';

import { SaveContactComponent } from './save-contact.component';

describe('SaveContactComponent', () => {
  let component: SaveContactComponent;
  let fixture: ComponentFixture<SaveContactComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [SaveContactComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule],
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
