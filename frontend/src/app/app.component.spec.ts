import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FlightService} from './services/flight/flight.service';
import {of} from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let flightServiceSpy: jasmine.SpyObj<FlightService>;

  beforeEach(() => {
    const flightServiceMock = jasmine.createSpyObj('FlightService', ['getFlightList']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: FlightService, useValue: flightServiceMock }],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    flightServiceSpy = TestBed.inject(FlightService) as jasmine.SpyObj<FlightService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve flight list on initialization', () => {
    const mockFlights = [{ id: 1, name: 'Flight 1' }, { id: 2, name: 'Flight 2' }];
    flightServiceSpy.getFlightList.and.returnValue(of({ flights: mockFlights }));

    component.ngOnInit();

    expect(component.flights).toEqual(mockFlights);
    expect(component.selectedFlight).toEqual(mockFlights[0]);
    expect(flightServiceSpy.getFlightList).toHaveBeenCalled();
  });

  it('should change selected flight', () => {
    const newSelectedFlight = { id: 3, name: 'Flight 3' };
    component.changeSelectedFlight(newSelectedFlight);

    expect(component.selectedFlight).toEqual(newSelectedFlight);
  });
});
