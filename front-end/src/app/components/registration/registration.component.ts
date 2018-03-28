import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private requestService: RequestService,
              private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
      email: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }

  formSubmit(): void {
    this.requestService.registration(this.registrationForm.value)
      .subscribe(
        (resp: any) => {
          resp && this.localStorageService.setUser(resp);
        },
        (error: any) => {
          console.log(error)
        })
  }

}
