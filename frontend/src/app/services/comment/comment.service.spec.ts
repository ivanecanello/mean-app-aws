import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommentService} from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve comment list', () => {
    const mockComments = [{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }];

    service.getCommentList().subscribe((response) => {
      expect(response).toEqual(mockComments);
    });

    const req = httpTestingController.expectOne('http://localhost:4000/comments');
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should retrieve comment list by flight id', () => {
    const flightId = 123;
    const mockComments = [{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }];

    service.getCommentListByFlightId(flightId).subscribe((response) => {
      expect(response).toEqual(mockComments);
    });

    const req = httpTestingController.expectOne(`http://localhost:4000/comments/byflightid/${flightId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });
});
