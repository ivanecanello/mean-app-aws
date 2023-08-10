import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  //baseUri: string = 'http://localhost:4000/comments';
  baseUri: string = '/api/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _http: HttpClient) {}

  addComment(data: any): Observable<any> {
    return this._http
      .post(this.baseUri, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  updateComment(id: number, data: any): Observable<any> {
    return this._http
      .put(`${this.baseUri}${id}/`, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  getCommentList(): Observable<any> {
    return this._http.get(this.baseUri);
  }

  getCommentListById(id: number): Observable<any> {
    return this._http
      .get(`${this.baseUri}${id}/`, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  getCommentListByFlightId(flightId: number): Observable<any> {
    return this._http
      .get(`${this.baseUri}byflightid/${flightId}/`, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  deleteComment(id: number): Observable<any> {
    return this._http
      .delete(`${this.baseUri}${id}/`, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
