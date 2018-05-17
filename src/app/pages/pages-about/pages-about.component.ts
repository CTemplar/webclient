import { Component, OnInit, OnDestroy } from '@angular/core';
import { NumberOfColumns, Mode } from '../../store/models';
import {
   FinalLoading
} from '../../store/actions';

// Store
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-pages-about',
  templateUrl: './pages-about.component.html',
  styleUrls: ['./pages-about.component.scss']
})
export class PagesAboutComponent implements OnInit, OnDestroy {
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
    this.store.dispatch(new FinalLoading({ loadingState: false}));
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
