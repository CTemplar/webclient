import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-image',
  templateUrl: './spinner-image.component.html',
  styleUrls: ['./spinner-image.component.scss'],
})
export class SpinnerImageComponent {
  isLoaded = false;

  @Input() src: string;

  @Input() class: string;
}
