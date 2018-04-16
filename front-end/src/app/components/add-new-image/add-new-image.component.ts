import { Component, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from "@angular/forms";
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
  addedImages: any[] = [];
  inputFileModel: any[] = [];

  constructor(private requestService: RequestService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private eventsExchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.currentCollection = this.activatedRoute.parent.params['value']['id'];
    this.addImageForm = this.formBuilder.group({
      imagesArray: this.formBuilder.array([])
    })
  }

  submitForm() {
    let form = new FormData();
    form.append('collectionId', this.currentCollection);
    for (let i: number = 0; i < this.addImageForm.value.imagesArray.length; i++) {
      form.append('images', this.addImageForm.value.imagesArray[i].file, this.addImageForm.value.imagesArray[i].title);
    }
    this.requestService.addImage(form)
    .subscribe(
      (images: any) => {
        this.eventsExchangeService.imageAdded.next(images);
        this.closeModal.emit();
    },
      (err: any) => {

      });
  }

  imagesAdded(event: any): void {
    this.addedImages = event.target.files;
    for (let i: number = 0; i < this.addedImages.length; i++) {
      if ('image/gif image/png image/jpeg'.indexOf(this.addedImages[i].type) !== -1) {
        (<FormArray>this.addImageForm.controls['imagesArray']).push(this.formBuilder.group({
          title: [this.addedImages[i].name],
          file: [this.addedImages[i]]
        }))
      }
    }
  }

  removeImage(event: any): void {
    if (event.target.dataset.index) {
      (<FormArray>this.addImageForm.controls['imagesArray']).removeAt(event.target.dataset.index);
    }
  }
}
