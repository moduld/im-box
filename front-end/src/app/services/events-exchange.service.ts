import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class EventsExchangeService {

  collectionCreated: Subject<any> = new Subject<any>();
}
