import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
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
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
      this.stageName = data.get('stageName');
    });
  }


  

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

  async saveTask() {
    let message = 'Tasks Added!';
    console.log(this.taskList);
    await this.userService
      .getStageList(this.boardName)
      .toPromise()
      .then(
        (response) => {
          console.log('Stage List fetched from server');
          this.stageList = response;
          console.log(this.stageList);
        },
        (error) => {
          console.log('Error fetching StageList', error);
          alert('Error Fetching Stage List');
        }
      );

    for (let task of this.taskList) {
      await this.userService
        .addTaskToStage(task, this.stageName, this.boardName)
        .toPromise()
        .then(
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
              this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
            });

            snackBarRef.afterDismissed().subscribe(() => {
              this.route.navigate(['/user', this.boardName, 'assignTask']);
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
              this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
            });
          }
        );
    }

    

    
  }
}
