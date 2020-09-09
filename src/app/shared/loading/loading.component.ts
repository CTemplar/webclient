import { Component, OnInit, Input } from '@angular/core';
import { LOADING_IMAGE } from '../../store/services';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input('isLoading') isLoading?: boolean;
  @Input('quote') quote?: any;
  loadingImage = LOADING_IMAGE;

  constructor() {}

  ngOnInit() {}
}
