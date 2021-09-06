import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { GenericFolderComponent } from './generic-folder.component';

describe('GenericFolderComponent', () => {
  let component: GenericFolderComponent;
  let fixture: ComponentFixture<GenericFolderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [GenericFolderComponent],
      providers: [provideMockStore({})],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
