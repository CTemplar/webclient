import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() value: number = 5;
  options: Options = {
    floor: 0,
    ceil: 50,
    showSelectionBar: true,
  };

  constructor() {}

  ngOnInit(): void {}
}
