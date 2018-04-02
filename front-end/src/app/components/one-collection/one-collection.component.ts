import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-one-collection',
  templateUrl: './one-collection.component.html',
  styleUrls: ['./one-collection.component.scss']
})

export class OneCollectionComponent implements OnInit {

  collection: any = null;
  images: any[] = [];

  constructor(private requestService: RequestService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }


  ngOnInit() {
    this.requestService.getOneCollection(this.activatedRoute.params['value']['id'])
      .subscribe(
        (collection: any) => {
          console.log(collection);
          this.collection = collection;
        },
        (error: any) => {

        });

    this.requestService.getCollectionImages(this.activatedRoute.params['value']['id'])
      .subscribe(
        (images: any) => {
          console.log(images);
          this.images = images;
        },
        (error: any) => {

        });

    this.eventsExchangeService.imageAdded
      .subscribe(
        (image: any) => {
          this.images.unshift(image)
        })
  }


}
