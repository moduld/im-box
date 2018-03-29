import { TestBed, inject } from '@angular/core/testing';

import { EventsExchangeService } from './events-exchange.service';

describe('EventsExchangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsExchangeService]
    });
  });

  it('should be created', inject([EventsExchangeService], (service: EventsExchangeService) => {
    expect(service).toBeTruthy();
  }));
});
