import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showLogin: boolean = true;

  constructor(private localStorageService: LocalStorageService,
              private router: Router) {}

  ngOnInit(): void {
    this.showLogin = !this.localStorageService.getUser();
    this.router.events
      .map((event: any) => event instanceof NavigationEnd)
      .subscribe(() => {
        this.showLogin = !this.localStorageService.getUser();
      })
  }

  logOut(): void {
    this.localStorageService.deleteUser();
    this.router.navigate(['login']);
    this.showLogin = !this.localStorageService.getUser();
  }
}
