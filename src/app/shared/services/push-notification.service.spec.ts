import { TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { PushNotificationService } from './push-notification.service';

describe('PushNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideMockStore({})],
  }));

  it('should be created', () => {
    const service: PushNotificationService = TestBed.get(PushNotificationService);
    expect(service).toBeTruthy();
  });
});
