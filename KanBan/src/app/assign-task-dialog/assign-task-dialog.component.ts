import { Component, Inject, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-assign-task-dialog',
  templateUrl: './assign-task-dialog.component.html',
  styleUrls: ['./assign-task-dialog.component.css'],
})
export class AssignTaskDialogComponent {
  boardName: any = '';
  memberList: any[] = [];
  spinnerActive: boolean = false;

  taskList: any[] = [];
  filteredTaskList: any[] = [];
  selectedMember: String = '';
  selectedTask: String = '';

  constructor(
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.boardName = this.data.boardName;
  }

  ngOnInit(): void {
    this.getListOfMembers();
    this.getListOfTasks();
  }

  getListOfMembers() {
    this.userService.getMemberList(this.boardName).subscribe({
      next: (response) => {
        this.memberList = response;
        console.log('Member List fetched', response);
      },
      error: (error) => {
        console.log('Error fetching Member List ', error);
      },
    });
  }

  getListOfTasks() {
    this.userService.getTaskList(this.boardName).subscribe({
      next: (data) => {
        //let tempTaskList = data;
        console.log('Task List fetched', data);
        this.taskList = data;
        console.log('UnfilteresTaskList' + this.taskList);

        this.filteredTaskList = this.taskList.filter((item) => {
          return item.assigned === false;
        });
        // console.log("FilteredTaskList"+this.filteredTaskList);
      },
      error: (error) => {
        console.log('Error fetching Task List!', error);
      },
    });
  }

  Submit(): void {
    this.spinnerActive = true;
    console.log(this.spinnerActive);
    this.userService
      .addTaskToMember(this.boardName, this.selectedMember, this.selectedTask)
      .subscribe({
        next: (data) => {
          console.log(data);

          let snackBarRef = this.snackBar.open(
            `Task assigned successfully...`,
            'OK',
            {
              duration: 2000,
              // verticalPosition: 'bottom', // Set vertical position to top
              panelClass: ['snackbar'],
            }
          );

          snackBarRef.afterOpened().subscribe(() => {
            const snackBarContainer = document.querySelector(
              '.snackbar'
            ) as HTMLElement;
            this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
            this.spinnerActive = false;
            this.dialogRef.close();
          });

          this.userService.getTaskList(this.boardName).subscribe({
            next: (data) => {
              //let tempTaskList = data;
              console.log('Task List fetched', data);
              this.taskList = data;
              console.log('UnfilteresTaskList' + this.taskList);

              this.filteredTaskList = this.taskList.filter((item) => {
                return item.assigned === false;
              });
              console.log('filter :: ' + this.filteredTaskList);

              if (this.filteredTaskList.length >= 1) {
                this.selectedTask = this.filteredTaskList[0].taskId;
              } else {
                this.selectedTask = '';
              }

              console.log(' selected Task is' + this.selectedTask);
              console.log('FilteredTaskList' + this.filteredTaskList);
            },
            error: (error) => {
              console.log('Error fetching Task List!', error);
            },
          });
        },
        error: (error) => {
          console.log(error);
          let errorMessage = error.statusText;
          if (error.statusText === 'Bad Request') {
            errorMessage = 'Cannot assign more than 3 task to this member !';
          }

          let snackBarRef = this.snackBar.open(errorMessage, 'OK', {
            duration: 3000,
            // verticalPosition: 'bottom', // Set vertical position to top
            panelClass: ['snackbar'],
          });

          snackBarRef.afterOpened().subscribe(() => {
            const snackBarContainer = document.querySelector(
              '.snackbar'
            ) as HTMLElement;
            this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
            this.spinnerActive = false;
            this.dialogRef.close();
          });
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
