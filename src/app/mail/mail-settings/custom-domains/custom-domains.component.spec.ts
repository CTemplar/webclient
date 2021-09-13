import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CustomDomainsComponent } from './custom-domains.component';

describe('CustomDomainsComponent', () => {
  let component: CustomDomainsComponent;
  let fixture: ComponentFixture<CustomDomainsComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [CustomDomainsComponent],
      providers: [provideMockStore({})],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
