import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskComponent } from 'src/app/update-task/update-task.component';
import { TaskDetailsComponent } from 'src/app/task-details/task-details.component';
import { AddTaskDialogComponent } from 'src/app/add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css'],
})
export class StageComponent implements OnInit {
  @Input()
  stage: any = {};

  stageList: any[] = [];

  selectedTask: any = null;
  @Input()
  boardNameReceived: any = '';

  constructor(
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit() {
    this.getAllStages();
  }
  onClick(task: any) {
    if (this.selectedTask === task) {
      this.selectedTask = null; // Unselect the task
    } else {
      this.selectedTask = task; // Select the task
    }
  }

  delete(task: any): void {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
    });
    const confirmDelete = confirm('Are you sure you want to delete this Task?');
    if (confirmDelete && task) {
      console.log('Deleting task with id:', task.taskId);

      this.userService
        .deleteTask(this.boardName, this.stage.stageName, task.taskId)
        .subscribe(
          (response) => {
            // Handle success
            console.log('Task deleted successfully:', response);
            this.stage.myTasks = this.stage.myTasks.filter(
              (t: any) => t.taskId !== task.taskId
            );
          },
          (error) => {
            // Handle error
            console.error('Error deleting task:', error);
          }
        );
    }
  }

  getAllStages() {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');

      this.userService.getStageList(this.boardName).subscribe(
        (success) => {
          // console.log(success);
          this.stageList = success;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

  
      // console.log(event.previousContainer);

      let stageindex: any = event.previousContainer.id.substring(14);
      console.log(event.previousContainer.id);
      console.log(stageindex);

      const fromStage = this.stageList[stageindex].stageName;

      const toStage = this.stage.stageName;

      console.log(fromStage);
      console.log(toStage);

      this.addTasksFromOneToAnotherStage(
        event.container.data[event.currentIndex],
        fromStage,
        toStage
      );

      console.log(fromStage);
      console.log(toStage);
    }
  }

  boardName: any = '';
  addTasksFromOneToAnotherStage(task: any, fromStage: any, toStage: any) {
    console.log(fromStage, toStage);
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
    });
    this.userService
      .moveTaskToAnotherStage(this.boardName, fromStage, toStage, task)
      .subscribe(
        (response) => {
          // Handle success
          console.log('Task moved successfully:', response);
        },
        (error) => {
          // Handle error
          console.error('Error moving task:', error);
        }
      );
  }

  openEditDialog(task: any): void {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
    });
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '500px',
      data: { task, boardName: this.boardName, stage: this.stage.stageName },
    });

    dialogRef.afterClosed().subscribe((updatedTask) => {
      if (updatedTask) {
        // Handle the updated task (e.g., update it in your task list)
      }
    });
  }

  openDetailsDialog(task: any, boardName: any) {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      data: { task, boardName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any action after dialog is closed
      console.log('The dialog was closed');
    });
  }

  openAddTaskDialog(stage: any): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '600px',
      data: {
        boardName: this.boardName,
        stage,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any actions after the dialog is closed
      // this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.route.navigate(['/user', this.boardName, 'home']);
      // });
      
    });
    
  }
}
