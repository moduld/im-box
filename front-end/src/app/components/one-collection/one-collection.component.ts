import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-one-collection',
  templateUrl: './one-collection.component.html',
  styleUrls: ['./one-collection.component.scss']
})

export class OneCollectionComponent implements OnInit {

  collection: any = null;

  constructor(private requestService: RequestService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    this.requestService.getOneCollection(this.activatedRoute.params['value']['id'])
      .subscribe(
        (collection: any) => {
          console.log(collection);
          this.collection = collection;
        },
        (error: any) => {

        })
  }

}
