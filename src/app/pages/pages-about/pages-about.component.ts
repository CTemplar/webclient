import { Component, OnInit } from '@angular/core';
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
export class PagesAboutComponent implements OnInit {
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
    this.store.dispatch(new FinalLoading({}));
  }

}
