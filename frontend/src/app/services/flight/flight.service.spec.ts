import {TestBed} from '@angular/core/testing';
import {FlightService} from './flight.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('FlightService', () => {
  let service: FlightService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightService],
    });
    service = TestBed.inject(FlightService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve flight list', () => {
    const mockFlights = [{ id: 1, name: 'Flight 1' }, { id: 2, name: 'Flight 2' }];

    service.getFlightList().subscribe((response) => {
      expect(response).toEqual({ flights: mockFlights });
    });

    const req = httpTestingController.expectOne('./assets/flights.json');
    expect(req.request.method).toBe('GET');
    req.flush({ flights: mockFlights });
  });
});
