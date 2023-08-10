import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {CommentListComponent} from './comment-list.component';
import {CommentService} from '../services/comment/comment.service';
import {CoreService} from '../core/core.service';
import {of} from 'rxjs';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let coreServiceSpy: jasmine.SpyObj<CoreService>;

  beforeEach(() => {
    const commentServiceMock = jasmine.createSpyObj('CommentService', [
      'getCommentListByFlightId',
      'deleteComment',
    ]);
    const coreServiceMock = jasmine.createSpyObj('CoreService', ['openSnackBar']);

    TestBed.configureTestingModule({
      declarations: [CommentListComponent],
      imports: [MatDialogModule, MatTableDataSource, MatPaginatorModule, MatSortModule],
      providers: [
        { provide: CommentService, useValue: commentServiceMock },
        { provide: CoreService, useValue: coreServiceMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentListComponent);
    component = fixture.componentInstance;
    commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    coreServiceSpy = TestBed.inject(CoreService) as jasmine.SpyObj<CoreService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get comment list', () => {
    const mockComments = [{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }];
    const getCommentListByFlightIdSpy = commentServiceSpy.getCommentListByFlightId.and.returnValue(
      of(mockComments)
    );

    component.currentFlight = { id: 123, name: 'Test Flight' };
    component.getCommentList();

    expect(getCommentListByFlightIdSpy).toHaveBeenCalledWith(123);
    expect(component.dataSource.data).toEqual(mockComments);
  });

  it('should delete comment', () => {
    const commentId = 456;
    const deleteCommentSpy = commentServiceSpy.deleteComment.and.returnValue(of({}));

    component.deleteComment(commentId);

    expect(deleteCommentSpy).toHaveBeenCalledWith(commentId);
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Comment deleted!', 'done');
    expect(commentServiceSpy.getCommentListByFlightId).toHaveBeenCalled();
  });
});
