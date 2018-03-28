import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private requestService: RequestService,
              private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }

  formSubmit(): void {
    this.requestService.logIn(this.loginForm.value)
      .subscribe(
        (resp: any) => {
          resp && this.localStorageService.setUser(resp);
      },
        (error: any) => {
        console.log(error)
      })
  }

}
