import { Component, OnInit } from '@angular/core';
import { apiUrl } from '../../config';

@Component({
  selector: 'app-bitcoin-form',
  templateUrl: './bitcoin-form.component.html',
  styleUrls: ['./bitcoin-form.component.scss']
})
export class BitcoinFormComponent implements OnInit {

  public apiUrl: string = apiUrl;
  constructor() { }

  ngOnInit() {
  }
}
