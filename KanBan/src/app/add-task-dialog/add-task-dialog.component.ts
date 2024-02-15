import { Component, Inject, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StageComponent } from '../home/stage/stage.component';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
})
export class AddTaskDialogComponent {
  stageList: any[] = [];
  stageName: any = '';
  taskList: any[] = [
    {
      taskId: '',
      taskName: '',
      taskDescription: '',
      priority: '',
      creationDate: new Date(),
      creationTime: new Date().toLocaleTimeString(),
    },
  ];
  boardName: any = '';
  priorityList: any[] = ['High', 'Normal', 'Low'];

  constructor(
    private userService: UserService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<StageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.boardName = data.boardName;
    this.stageName = data.stage.stageName;
    console.log(data.boardName);
    console.log(data.stage.stageName);
  }

  ngOnInit(): void {}

  addTask() {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();

    this.taskList.push({
      taskId: '',
      taskName: '',
      taskDescription: '',
      priority: '',
      creationDate: currentDate,
      creationTime: currentTime,
    });
  }

  removeNewTask(i: number) {
    this.taskList.splice(i, 1);
  }

  saveTask() {
    let message = 'Tasks Added!';
    console.log(this.taskList);
    let task = this.taskList[0];

    if (task.taskName) {
      this.userService
        .addTaskToStage(task, this.stageName, this.boardName)
        .subscribe(
          (response) => {
            console.log('Task added!!', response);

            let snackBarRef = this.snackBar.open(
              `Tasks added successfully...`,
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
              this.renderer.setStyle(
                snackBarContainer,
                'margin-bottom',
                '10rem'
              ); // Adjust margin as needed
            });

            snackBarRef.afterDismissed().subscribe(() => {
              this.route.navigate(['/user', this.boardName, 'home']);
            });
            
          },
          (error) => {
            console.log('Error adding Task!', error);
            let snackBarRef = this.snackBar.open(
              `Something went wrong !`,
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
              this.renderer.setStyle(
                snackBarContainer,
                'margin-bottom',
                '10rem'
              ); // Adjust margin as needed
            });
          }
        );
    }

    this.dialogRef.close();
    window.location.reload();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
