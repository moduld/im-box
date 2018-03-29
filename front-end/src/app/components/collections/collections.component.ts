import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  collections: any[] = [];
  collectionsAreVisible: boolean = true;

  constructor(private requestService: RequestService,
              private eventsExchangeService: EventsExchangeService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.collectionsAreVisible = !(this.activatedRoute.firstChild &&  this.activatedRoute.firstChild.component['name'] === 'OneCollectionComponent');
    this.router.events
      .filter((event: RouterEvent) => event instanceof NavigationEnd)
      .subscribe(() => {
        this.collectionsAreVisible = !(this.activatedRoute.firstChild &&  this.activatedRoute.firstChild.component['name'] === 'OneCollectionComponent');
      });

    this.eventsExchangeService.collectionCreated
      .subscribe((collection: any) => {
        this.collections.unshift(collection);
      });
    this.requestService.getCollections()
      .subscribe(
      (collections: any) => {
        this.collections = collections;
        console.log(collections)
        },
        error => {

        })
  }

}
