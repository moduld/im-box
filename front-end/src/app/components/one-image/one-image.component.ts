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

  constructor(private requestService: RequestService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }

  ngOnInit(): void {
    this.currentImageId = this.activatedRoute.params['value']['img-id'];
    this.requestService.getOneImage(this.currentImageId)
      .subscribe(
        (image: any) => {
          this.currentImageData = image;
          this.changeTitleForm = this.formBuilder.group({
            title: [image.title],
            collection: [image.collectionId]
          })
        },
        (error: any) => {

        })
  }

  changeTitle(): void {

  }

}
