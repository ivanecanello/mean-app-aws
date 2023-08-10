import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CommentFormComponent} from "../comment-form/comment-form.component";
import {MatDialog} from "@angular/material/dialog";
import {CommentService} from "../services/comment/comment.service";
import {CoreService} from "../core/core.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  private _currentFlight = new BehaviorSubject<any>([]);

  @Input()
  set currentFlight(value) { this._currentFlight.next(value); };
  get currentFlight() { return this._currentFlight.getValue(); }


  displayedColumns: string[] = [
    'id',
    'comment',
    'user',
    'tags',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _commentService: CommentService,
    private _coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    this._currentFlight.subscribe(x => {this.getCommentList();});

  }

  openCommentForm() {
    let data = {
      existingComment: null,
      currentFlight: this.currentFlight
    }

    const dialogRef = this._dialog.open(CommentFormComponent, {
      data
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCommentList();
        }
      },
    });
  }

  getCommentList() {
    this._commentService.getCommentListByFlightId(this.currentFlight.id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          return data.comment.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteComment(id: number) {
    this._commentService.deleteComment(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Comment deleted!', 'done');
        this.getCommentList();
      },
      error: console.log,
    });
  }

  openEditForm(row: any) {
    let data = {
      existingComment: row,
      currentFlight: this.currentFlight
    }

    const dialogRef = this._dialog.open(CommentFormComponent, {
      data
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCommentList();
        }
      },
    });
  }
}
