import { Component, OnInit } from '@angular/core';

import { apiUrl } from '../../config';

@Component({
  selector: 'app-bitcoin-form',
  templateUrl: './bitcoin-form.component.html',
  styleUrls: ['./bitcoin-form.component.scss'],
})
export class BitcoinFormComponent {
  public apiUrl: string = apiUrl;
}
