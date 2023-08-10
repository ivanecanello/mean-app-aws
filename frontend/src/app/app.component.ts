import {Component, OnInit} from '@angular/core';
import {FlightService} from "./services/flight/flight.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  flights: any;
  selectedFlight: any;

  constructor(
    private _flightService: FlightService
  ) {
  }

  ngOnInit(): void {
    this.getFlightList();
  }

  getFlightList() {
    this._flightService.getFlightList().subscribe({
      next: (res) => {
        this.flights = res.flights;
        this.selectedFlight = this.flights[0];
      },
      error: console.log,
    });
  }

  changeSelectedFlight(flight: any) {
    this.selectedFlight = flight;
  }

}
