import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-sort-all-images',
  templateUrl: './sort-all-images.component.html',
  styleUrls: ['./sort-all-images.component.scss']
})
export class SortAllImagesComponent implements OnInit {

  images: any[] = [];
  collections: any[] = [];
  startSlider: EventEmitter<null> = new EventEmitter<null>();
  alreadySortedImages: any = [];

  constructor(private requestService: RequestService, private router: Router) { }

  ngOnInit(): void {
    this.requestService.getCollections()
      .subscribe(
        (collections: any) => {
          collections = collections.map(item => {
            item.images = [];
            item.showMenu = false;
            return item;
          });
          this.collections = collections;
        },
        error => {

        });

    this.requestService.getAllImages()
      .subscribe(
        (images: any) => {
          images = images.map((item: any) => {
            item.newCollId = '';
            return item;
          });
          this.images = images;
        },
        (error: any) => {

        });
  }

  addDropItem(image, collection): void {
    if (image['collectionId'] !== collection.id) {
      image['newCollId'] = collection.id;
      collection.images.push(image);
      this.alreadySortedImages.push(image);
    }
  }

  handleClickEvents(event): void {
    if (event.target.dataset['button']) {
      let type = event.target.dataset['button'];
      let colIndex = event.target.dataset['index'];
      if (type === 'showMenu'){
        this.collections[colIndex]['showMenu'] = !this.collections[colIndex]['showMenu'];
      }
      if (type === 'removeImage') {
        let imgIndex = event.target.dataset['imgIndex'];
        let imgId = event.target.dataset['id'];
        this.collections[colIndex].images.splice(imgIndex, 1);
        this.alreadySortedImages = this.alreadySortedImages.filter(item => {
          return item.id !== imgId;
        });
        if (!this.collections[colIndex].images.length) {
          this.collections[colIndex]['showMenu'] = false;
        }
      }
    }
  }

  finishSorting(): void {
    let requestData = this.alreadySortedImages.map((item: any) => {
      return {
        id: item.id,
        newCollection: item.newCollId
      }
    });
    console.log(requestData)
    this.requestService.changeImageCollection(requestData)
      .subscribe(
        (images: any) => {
          this.router.navigate(['collections'])
        },
        (error: any) => {

        });
  }
}
