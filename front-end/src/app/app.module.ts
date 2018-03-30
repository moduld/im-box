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
import { OneCollectionComponent } from './components/one-collection/one-collection.component';
import { AddNewImageComponent } from './components/add-new-image/add-new-image.component';
import { ModalWrapperComponent } from './components/modal-wrapper/modal-wrapper.component';

import { RequestService } from './services/request.service';
import { LocalStorageService } from './services/local-storage.service';
import { EventsExchangeService } from './services/events-exchange.service';

import { FileValidator } from './directives/input-file-validate.directive';
import { FileValueAccessorDirective } from './directives/file-value-accessor.directive';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegistrationComponent,
    CollectionsComponent,
    AddNewCollectionComponent,
    OneCollectionComponent,
    AddNewImageComponent,
    ModalWrapperComponent,
    FileValidator,
    FileValueAccessorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    RequestService,
    LocalStorageService,
    EventsExchangeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
