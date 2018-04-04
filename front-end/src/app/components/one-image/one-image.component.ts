import { Component, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-one-image',
  templateUrl: './one-image.component.html',
  styleUrls: ['./one-image.component.scss']
})
export class OneImageComponent implements OnInit {

  closeModal: EventEmitter<null> = new EventEmitter<null>();
  changeTitleForm: FormGroup;
  currentImageId: string = '';
  currentImageData: any = null;
  collections: any[] = [];
  titleWasChanged: boolean = false;
  collectionWasChanged: boolean = false;

  constructor(private requestService: RequestService,
              private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }

  ngOnInit(): void {
    this.currentImageId = this.activatedRoute.params['value']['img-id'];
    this.changeTitleForm = this.formBuilder.group({
      title: [''],
      collection: ['']
    });
    this.changeTitleForm.get('title').valueChanges
      .subscribe(() => {
      this.titleWasChanged = true;
    });
    this.changeTitleForm.get('collection').valueChanges
      .subscribe(() => {
      this.collectionWasChanged = true;
    });
    this.requestService.getOneImage(this.currentImageId)
      .subscribe(
        (image: any) => {
          this.currentImageData = image;
          this.changeTitleForm.patchValue({
              title: image.title,
              collection: image.collectionId
            });
          this.titleWasChanged = false;
          this.collectionWasChanged = false;
        },
        (error: any) => {

        });
    this.requestService.getCollections()
      .subscribe(
        (collections: any) => {
          this.collections = collections;
        },
        (error: any) => {

        })
  }

  submitForm(): void {
    if (this.titleWasChanged) {
      this.requestService.changeImageTitle(this.currentImageId, {title: this.changeTitleForm.value['title']})
        .subscribe(
          (image: any) => {
            this.titleWasChanged = false;
            image.event = 'title';
            this.eventsExchangeService.imageDataChanged.next(image);
          },
          (error: any) => {

          })
    }
    if (this.collectionWasChanged) {
      this.requestService.changeImageCollection([{id: this.currentImageId, newCollection: this.changeTitleForm.value['collection']}])
        .subscribe(
          (image: any[]) => {
            this.collectionWasChanged = false;
            image[0].event = 'collection';
            this.eventsExchangeService.imageDataChanged.next(image[0]);
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
          },
          (error: any) => {

          })
    }
  }

  deleteImage(): void {
    this.requestService.deleteImages([this.currentImageId])
      .subscribe(
        (resp: any[]) => {
          if (resp && resp['success']) {
            this.eventsExchangeService.imageDeleted.next(this.currentImageId);
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
          }
        },
        (error: any) => {

        })
  }

}
