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

  constructor(private requestService: RequestService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.activatedRoute.parent.params['value']['id']);
    this.addImageForm = this.formBuilder.group({
      title: [''],
      image: ['']
    })
  }

}
