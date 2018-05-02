// Angular
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Helpers
import { apiUrl } from './config';
import { Observable } from 'rxjs/Observable';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Injectable()
export class SharedService {
  isReady: EventEmitter<boolean> = new EventEmitter();
  hideFooter: EventEmitter<boolean> = new EventEmitter();
  hideHeader: EventEmitter<boolean> = new EventEmitter();

  //
  // constructor(
  //   private http: HttpClient,
  // ) {}
  //
  // patchReferrer(slug: string): void {
  //   const url = `${apiUrl}stats/referrer/${slug}/`;
  //   this.http.patch(url, {'trigger': true}).subscribe();
  // }
  //
  // // Immediate start of setInterval function
  // startInterval(seconds, callback) {
  //   callback();
  //   return setInterval(callback, seconds * 1000);
  // }
}
