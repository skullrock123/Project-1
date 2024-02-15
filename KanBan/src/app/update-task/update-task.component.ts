import { UserService } from './../services/user.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StageComponent } from './../home/stage/stage.component';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css'],
})
export class UpdateTaskComponent {
  updatedTaskName: string;
  updatedPriority: string;
  updatedTaskDescription: string;

  constructor(
    public dialogRef: MatDialogRef<StageComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { task: any; boardName: any; stage: any },
    private userService: UserService
  ) {
    // Initialize the input fields with the current values
    this.updatedTaskName = data.task.taskName;
    this.updatedTaskDescription = data.task.taskDescription;
    this.updatedPriority = data.task.priority;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // Save the updated values and close the dialog
    this.data.task.taskName = this.updatedTaskName;
    this.data.task.taskDescription = this.updatedTaskDescription;
    this.data.task.priority = this.updatedPriority;

    this.userService
      .updateTask(this.data.boardName, this.data.stage, this.data.task)
      .subscribe(
        (data) => {
          // Handle the updated task received from the backend (if needed)
          console.log('Task updated successfully:', data);
          // this.dialogRef.close(data); // Close the dialog with the updated task
        },
        (error) => {
          // Handle errors
          console.error('Error updating task:', error);
          // You can choose to handle errors differently if needed
        }
      );

    this.dialogRef.close(this.data.task);
  }
}
