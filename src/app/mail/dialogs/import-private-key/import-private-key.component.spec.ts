import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';

import { ImportPrivateKeyComponent } from './import-private-key.component';

describe('ImportPrivateKeyComponent', () => {
  let component: ImportPrivateKeyComponent;
  let fixture: ComponentFixture<ImportPrivateKeyComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ImportPrivateKeyComponent],
      imports: [
        NgbModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        provideMockStore,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPrivateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
