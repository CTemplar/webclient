import { Component, ChangeDetectionStrategy } from '@angular/core';

import { apiUrl } from '../../config';

@Component({
  selector: 'app-bitcoin-form',
  templateUrl: './bitcoin-form.component.html',
  styleUrls: ['./bitcoin-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinFormComponent {
  public apiUrl: string = apiUrl;
}
