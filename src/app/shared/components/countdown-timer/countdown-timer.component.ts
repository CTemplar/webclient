import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { takeWhile } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input() duration: number; // duration in seconds

  @Output() finished = new EventEmitter<boolean>();

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor() {
  }

  ngOnInit() {
    Observable.timer(0, 1000)
      .takeUntil(this.destroyed$)
      .pipe(
        takeWhile(() => this.duration > 0)
      )
      .subscribe(res => {
        this.calculate();
        this.duration--;
        if (this.duration === 0) {
          this.finished.emit(true);
        }
      });
  }

  calculate() {
    let durationCopy = this.duration;
    this.days = Math.floor(durationCopy / 86400);
    durationCopy -= this.days * 86400;
    this.hours = Math.floor(durationCopy / 3600) % 24;
    durationCopy -= this.hours * 3600;
    this.minutes = Math.floor(durationCopy / 60) % 60;
    durationCopy -= this.minutes * 60;
    this.seconds = durationCopy % 60;
  }

  ngOnDestroy() {
  }

}
