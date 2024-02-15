import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignTaskDialogComponent } from '../assign-task-dialog/assign-task-dialog.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  boardName: any;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: any; boardName: any },
    private route: Router,
    private dialog: MatDialog
  ) {
    this.boardName = data.boardName;
  }
  ngOnInit(): void {
    console.log(this.data.task.creationDateTime);
  }

  close(): void {
    this.dialogRef.close();
  }

  doAssign(boardName: any) {
    this.dialogRef.close(); // Close the current dialog
    const dialogRef = this.dialog.open(AssignTaskDialogComponent, {
      width: '500px',
      data: { boardName: boardName, task: this.data.task }, // Pass necessary data to the dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed, if needed
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate(['/user', this.boardName, 'home']);
      });
    });
  }
}
