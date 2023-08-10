import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommentFormComponent} from './comment-form.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CommentService} from '../services/comment/comment.service';
import {CoreService} from '../core/core.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {of} from 'rxjs';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let coreServiceSpy: jasmine.SpyObj<CoreService>;
  let liveAnnouncerSpy: jasmine.SpyObj<LiveAnnouncer>;

  beforeEach(() => {
    const commentServiceMock = jasmine.createSpyObj('CommentService', ['addComment', 'updateComment']);
    const coreServiceMock = jasmine.createSpyObj('CoreService', ['openSnackBar']);
    const liveAnnouncerMock = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    TestBed.configureTestingModule({
      declarations: [CommentFormComponent],
      imports: [MatDialogModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CommentService, useValue: commentServiceMock },
        { provide: CoreService, useValue: coreServiceMock },
        { provide: LiveAnnouncer, useValue: liveAnnouncerMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    coreServiceSpy = TestBed.inject(CoreService) as jasmine.SpyObj<CoreService>;
    liveAnnouncerSpy = TestBed.inject(LiveAnnouncer) as jasmine.SpyObj<LiveAnnouncer>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update existing comment', () => {
    const existingComment = { id: 1, comment: 'Test Comment', tags: ['tag1', 'tag2'] };
    const updatedComment = { id: 1, comment: 'Updated Comment', tags: ['tag1', 'tag2'] };
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.callThrough();
    commentServiceSpy.updateComment.and.returnValue(of(updatedComment));
    component.existingComment = existingComment;
    component.currentFlight = { id: 123, name: 'Test Flight' };
    component.commentForm.patchValue({ comment: 'Updated Comment' });
    component.tags = existingComment.tags;

    component.onFormSubmit();

    expect(commentServiceSpy.updateComment).toHaveBeenCalledWith(existingComment.id, {
      comment: 'Updated Comment',
      tags: existingComment.tags,
    });
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Comment detail updated!');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should add new comment', () => {
    const newComment = { comment: 'New Comment', flightId: 123, userId: 1, tags: ['tag1', 'tag2'] };
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.callThrough();
    commentServiceSpy.addComment.and.returnValue(of(newComment));
    component.currentFlight = { id: 123, name: 'Test Flight' };
    component.commentForm.patchValue({ comment: 'New Comment' });
    component.tags = ['tag1', 'tag2'];

    component.onFormSubmit();

    expect(commentServiceSpy.addComment).toHaveBeenCalledWith(newComment);
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Comment added successfully');
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

});
