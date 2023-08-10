import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private _http: HttpClient) { }

  getFlightList(): Observable<any> {
    // retrieve hardcoded flights from json file
    return this._http.get("./assets/flights.json");
  }
}
