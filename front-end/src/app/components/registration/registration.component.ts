import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
              private router: Router,
              private requestService: RequestService,
              private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
      email: ['', Validators.required ],
      password: ['', Validators.required ],
      signIn: [true, Validators.required]
    });
  }

  formSubmit(): void {
    this.requestService.registration(this.registrationForm.value)
      .subscribe(
        (resp: any) => {
          if (this.registrationForm.value.signIn) {
            resp && this.localStorageService.setUser(resp);
            this.router.navigate(['collections']);
          }
          this.registrationForm.reset();
        },
        (error: any) => {
          console.log(error)
        })
  }

}
