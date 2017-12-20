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
  isMail: EventEmitter<boolean> = new EventEmitter();
  isBlogReady: EventEmitter<boolean> = new EventEmitter();
  isMailReady: EventEmitter<boolean> = new EventEmitter();
  isReady: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
  ) {}

  patchReferrer(slug: string): void {
    const url = `${apiUrl}stats/referrer/${slug}/`;
    this.http.patch(url, {'trigger': true}).subscribe();
  }

}
