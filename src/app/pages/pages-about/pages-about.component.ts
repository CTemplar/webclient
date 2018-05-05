import { Component, OnInit } from '@angular/core';
import { NumberOfColumns, Mode } from '../../models/blog';

@Component({
  selector: 'app-pages-about',
  templateUrl: './pages-about.component.html',
  styleUrls: ['./pages-about.component.scss']
})
export class PagesAboutComponent implements OnInit {
  numberOfColumns: NumberOfColumns;
  mode : Mode;
  constructor() { }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
  }

}
