import { Component, OnInit, Input } from '@angular/core';

import { LOADING_IMAGE } from '../../store/services';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() isLoading?: boolean;

  @Input() quote?: any;

  loadingImage = LOADING_IMAGE;

  constructor() {}
}
