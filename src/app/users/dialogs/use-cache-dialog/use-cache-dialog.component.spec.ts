import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UseCacheDialogComponent } from './use-cache-dialog.component';
import { StoreModule ,Store, StateObservable, ActionsSubject, ReducerManager, ReducerManagerDispatcher  } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('UseCacheDialogComponent', () => {
  let component: UseCacheDialogComponent;
  let fixture: ComponentFixture<UseCacheDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UseCacheDialogComponent],
      providers: [NgbActiveModal, Store, StateObservable, ActionsSubject, ReducerManager, ReducerManagerDispatcher],
      imports: [StoreModule.forRoot({}), TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCacheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
