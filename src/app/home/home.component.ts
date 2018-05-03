// Angular
import { Component, OnInit } from '@angular/core';
import { NumberOfColumns, Mode } from '../models/blog';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  constructor() { }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
  }

}
