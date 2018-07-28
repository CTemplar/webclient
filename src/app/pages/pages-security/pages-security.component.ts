// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

// Actions
import { FinalLoading } from '../../store/actions';

// Store
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-pages-security',
  templateUrl: './pages-security.component.html',
  styleUrls: ['./pages-security.component.scss']
})
export class PagesSecurityComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<any>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  ngOnDestroy() {
   // this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
