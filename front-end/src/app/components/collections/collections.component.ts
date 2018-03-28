import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  collections: any[] = [];

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.requestService.getCollections().subscribe(
      (collections: any) => {
      this.collections = collections;
      console.log(collections)
    },
        error => {

    })
  }

}
