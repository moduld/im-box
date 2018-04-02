import { Component, OnInit, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from '../../services/request.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-new-collection',
  templateUrl: './add-new-collection.component.html',
  styleUrls: ['./add-new-collection.component.scss']
})
export class AddNewCollectionComponent implements OnInit {

  addCollectionForm: FormGroup;
  closeModal: EventEmitter<null> = new EventEmitter<null>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private requestService: RequestService,
              private formBuilder: FormBuilder,
              private eventsExchangeService: EventsExchangeService) { }

  ngOnInit() {
    this.addCollectionForm = this.formBuilder.group({
      title: ['', [Validators.required] ]
    })
  }

  createGroup(): void {
    this.requestService.createCollection(this.addCollectionForm.value)
    .subscribe(
      (collection: any) => {
        this.eventsExchangeService.collectionCreated.next(collection);
        this.closeModal.emit();
      },
      (error: any) => {

      })
  }
}
