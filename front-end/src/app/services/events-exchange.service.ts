import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class EventsExchangeService {

  collectionCreated: Subject<any> = new Subject<any>();
  imageAdded: Subject<any> = new Subject<any>();
  imageDataChanged: Subject<any> = new Subject<any>();
  imageDeleted: Subject<any> = new Subject<any>();
}
