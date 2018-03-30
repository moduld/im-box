import { Component, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../services/request.service';

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
              private activatedRoute: ActivatedRoute) { }

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
    form.append('image', this.addImageForm.value.image);
    form.append('collectionId', this.currentCollection);
    this.requestService.addImage(form)
    .subscribe(
      (resp: any) => {
        console.log (resp);
    },
      (err: any) => {

      });

  }

}
