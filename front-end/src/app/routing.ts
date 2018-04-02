import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { AddNewCollectionComponent } from './components/add-new-collection/add-new-collection.component';
import { OneCollectionComponent } from './components/one-collection/one-collection.component';
import { AddNewImageComponent } from './components/add-new-image/add-new-image.component';
import { OneImageComponent } from './components/one-image/one-image.component';

const routes: Routes = [
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'collections',
    component: CollectionsComponent,
    children: [
      {
        path: 'add-new',
        component: AddNewCollectionComponent
      },
      {
        path: ':id',
        component: OneCollectionComponent,
        children: [
          {
            path: 'add-new',
            component: AddNewImageComponent
          },
          {
            path: ':img-id',
            component: OneImageComponent
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
