import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class RequestService {

  api: string = 'http://localhost:8001/api/v1';

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) { }

  logIn(form: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.httpClient.post<any>(`${this.api}/login`, JSON.stringify(form), requestOptions)
  }

  registration(form: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.httpClient.post<any>(`${this.api}/registration`, JSON.stringify(form), requestOptions)
  }

  getCollections(): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.get<any>(`${this.api}/collections`, requestOptions)
  }

  createCollection(form: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.post<any>(`${this.api}/collections`, JSON.stringify(form), requestOptions)
  }

  getOneCollection(id: string): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.get<any>(`${this.api}/collections/${id}`, requestOptions)
  }

  getCollectionImages(id: string): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.get<any>(`${this.api}/collections/${id}/images`, requestOptions)
  }

  addImage(form: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.post<any>(`${this.api}/images`, form, requestOptions)
  }

  getOneImage(id: string): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.get<any>(`${this.api}/images/${id}`, requestOptions)
  }

  changeImageCollection(requestBody: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.patch<any>(`${this.api}/images`, JSON.stringify(requestBody), requestOptions)
  }

  changeImageTitle(id: string, requestBody: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.put<any>(`${this.api}/images/${id}`, JSON.stringify(requestBody), requestOptions)
  }

  deleteImages(requestBody: any): Observable<any> {
    const requestOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.localStorageService.getUser().token}),
      body: JSON.stringify(requestBody)
    };
    return this.httpClient.delete<any>(`${this.api}/images`, requestOptions)
  }

  editCollection(id: string, requestBody: any): Observable<any> {
    const requestOptions: {headers} = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'authorization': this.localStorageService.getUser().token})
    };
    return this.httpClient.put<any>(`${this.api}/collections/${id}`, JSON.stringify(requestBody), requestOptions)
  }
}
