import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './routing';

import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { AddNewCollectionComponent } from './components/add-new-collection/add-new-collection.component';

import { RequestService } from './services/request.service';
import { LocalStorageService } from './services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegistrationComponent,
    CollectionsComponent,
    AddNewCollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    RequestService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
