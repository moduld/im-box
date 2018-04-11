import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class EventsExchangeService {

  renewCollectionsList: Subject<null> = new Subject<null>();
  imageAdded: Subject<any> = new Subject<any>();
  imageDataChanged: Subject<any> = new Subject<any>();
  imageDeleted: Subject<any> = new Subject<any>();
}
