import { Component } from '@angular/core';

import { PRIMARY_WEBSITE } from '../shared/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  primaryWebsite = PRIMARY_WEBSITE;
}
