import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-one-collection',
  templateUrl: './one-collection.component.html',
  styleUrls: ['./one-collection.component.scss']
})

export class OneCollectionComponent implements OnInit, OnDestroy {

  collection: any = {
    title: ''
  };
  images: any[] = [];
  addedSubscription: any;
  changedSubscription: any;
  deletedSubscription: any;
  labelledToDeleteId: string[] = [];
  currentCollectionId: string = '';

  constructor(private requestService: RequestService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }


  ngOnInit() {
    this.currentCollectionId = this.activatedRoute.params['value']['id'];
    this.requestService.getOneCollection(this.currentCollectionId)
      .subscribe(
        (collection: any) => {
          console.log(collection);
          this.collection = collection;
        },
        (error: any) => {

        });

    this.requestService.getCollectionImages(this.currentCollectionId)
      .subscribe(
        (images: any) => {

          this.images = images;
        },
        (error: any) => {

        });

    this.addedSubscription = this.eventsExchangeService.imageAdded
      .subscribe(
        (image: any) => {
          this.images.unshift(image)
        });

    this.changedSubscription = this.eventsExchangeService.imageDataChanged
      .subscribe(
        (image: any) => {
          console.log(image);
          let foundImage: any = this.findItem(image.id);
          if (foundImage !== -1) {
            if (image['event'] === 'title') {
              this.images[foundImage].title = image.title;
            }
            if (image['event'] === 'collection') {
              this.images.splice(foundImage, 1);
            }
          }
        });

    this.deletedSubscription = this.eventsExchangeService.imageDeleted
      .subscribe(
        (id: string) => {
          let foundImage: any = this.findItem(id);
          if (foundImage !== -1) {
            console.log(foundImage)
            this.images.splice(foundImage, 1);
          }
        }
      )
  }

  ngOnDestroy(): void {
    this.addedSubscription && this.addedSubscription.unsubscribe();
    this.changedSubscription && this.changedSubscription.unsubscribe();
    this.deletedSubscription && this.deletedSubscription.unsubscribe();
  }

  findItem(id: string): any {
    let imagesIds = this.images.map((img: any) => {
      return img.id;
    });

    return imagesIds.indexOf(id);
  }

  onContainerClick(event: any): void {
    if (event.target.dataset.id) {
      let id: string = event.target.dataset.id;
      let foundImageIndex: number = this.findItem(id);
      if (this.labelledToDeleteId.indexOf(id) === -1) {
        this.labelledToDeleteId.push(id);
        this.images[foundImageIndex]['labelledToDeleteId'] = true;
      } else {
        this.labelledToDeleteId.splice(this.labelledToDeleteId.indexOf(id), 1);
        this.images[foundImageIndex]['labelledToDeleteId'] = false;
      }
    }
  }

  deleteSelected(): void {
    if (this.labelledToDeleteId.length) {
      this.requestService.deleteImages(this.labelledToDeleteId)
        .subscribe(
          (images: any) => {
            this.labelledToDeleteId.forEach((id: string) => {
              let foundImageIndex: number = this.findItem(id);
              this.images.splice(foundImageIndex, 1);
            });
            this.labelledToDeleteId = [];
          },
          (error: any) => {

          });
    }
  }

  changeCollectionName(): void {
    this.requestService.editCollection(this.currentCollectionId,{title: this.collection.title})
      .subscribe(
        (collection: any) => {
          this.collection = collection;
        },
        (error: any) => {

        });
  }
}
