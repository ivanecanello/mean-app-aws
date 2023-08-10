import {Component, inject, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoreService} from '../core/core.service';
import {CommentService} from '../services/comment/comment.service';
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  currentFlight: any;
  existingComment: any;
  commentForm: FormGroup;
  tags: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _commentService: CommentService,
    private _dialogRef: MatDialogRef<CommentFormComponent>,
    private _coreService: CoreService
  ) {
    this.commentForm = this._fb.group({
      comment: ['', Validators.required]
    });
    this.currentFlight = data.currentFlight;
    this.existingComment = data.existingComment
    this.tags = this.existingComment ? this.existingComment.tags : [];
  }

  ngOnInit(): void {
    this.commentForm.patchValue(this.existingComment);
  }

  onFormSubmit() {
    if (this.commentForm.valid) {
      if (this.existingComment) {
        let commentToBeEdited = this.commentForm.value;
        commentToBeEdited.tags = this.tags;
        this._commentService
          .updateComment(this.existingComment.id, commentToBeEdited)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Comment detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        let commentToBeAdded = this.commentForm.value;
        commentToBeAdded.flightId = this.currentFlight.id;
        commentToBeAdded.userId = 1; // Here ideally you want to retrieve the user id from a session cache, a cookie, a customized user service, etc
        commentToBeAdded.tags = this.tags;

        this._commentService.addComment(commentToBeAdded).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Comment added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

  // functionality for chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit tag fruit
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }
}
