import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from '../../services/request.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-new-collection',
  templateUrl: './add-new-collection.component.html',
  styleUrls: ['./add-new-collection.component.scss']
})
export class AddNewCollectionComponent implements OnInit {

  @HostBinding('class.close-overlay') closeModBody: boolean = false;
  addCollectionForm: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private requestService: RequestService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addCollectionForm = this.formBuilder.group({
      title: ['', [Validators.required] ]
    })
  }

  closeModal(): void {
    this.closeModBody = true;
    let timeout = setTimeout(() => {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      clearTimeout(timeout);
    }, 300)
  }

  createGroup(): void {
    this.requestService.createCollection(this.addCollectionForm.value)
    .subscribe(
      (collection: any) => {
        console.log (collection);
      },
      (error: any) => {

      })
  }

}
