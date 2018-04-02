import { Component, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-add-new-image',
  templateUrl: './add-new-image.component.html',
  styleUrls: ['./add-new-image.component.scss']
})
export class AddNewImageComponent implements OnInit {

  closeModal: EventEmitter<null> = new EventEmitter<null>();
  addImageForm: FormGroup;
  currentCollection: string = '';

  constructor(private requestService: RequestService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentCollection = this.activatedRoute.parent.params['value']['id'];
    this.addImageForm = this.formBuilder.group({
      title: [''],
      image: ['', [Validators.required] ]
    })
  }

  addImage() {
    let form = new FormData();
    form.append('title', this.addImageForm.value.title);
    form.append('image', this.addImageForm.value.image[0]);
    form.append('collectionId', this.currentCollection);
    this.requestService.addImage(form)
    .subscribe(
      (image: any) => {
        this.eventsExchangeService.imageAdded.next(image);
        this.closeModal.emit();
    },
      (err: any) => {

      });

  }

}
