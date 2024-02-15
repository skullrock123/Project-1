import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task-to-member',
  templateUrl: './add-task-to-member.component.html',
  styleUrls: ['./add-task-to-member.component.css'],
})
export class AddTaskToMemberComponent implements OnInit {
  // boardName: any = '';
  // memberList: any[] = [];
  // taskList: any[] = [];
  // taskForm!: FormGroup;

  // constructor(
  //   private userService: UserService,
  //   private route: Router,
  //   private activeRoute: ActivatedRoute,
  //   private fb: FormBuilder
  // ) {}

  // ngOnInit(): void {
  //   this.activeRoute.paramMap.subscribe((data) => {
  //     this.boardName = data.get('boardName');
  //   });

  //   this.getListOfMembers();
  //   this.getListOfTasks();

  //   // Initialize the form with empty values and validation
  //   this.taskForm = this.fb.group({
  //     selectedMember: ['', Validators.required],
  //     selectedTask: ['', Validators.required],
  //   });
  // }

  // getListOfMembers() {
  //   this.userService.getMemberList(this.boardName).subscribe({
  //     next: (response) => {
  //       this.memberList = response;
  //       console.log('Member List fetched', response);
  //     },
  //     error: (error) => {
  //       console.log('Error fetching Member List ', error);
  //     },
  //   });
  // }

  // getListOfTasks() {
  //   this.userService.getTaskList(this.boardName).subscribe({
  //     next: (response) => {
  //       this.taskList = response;
  //       console.log('Task List fetched', response);
  //     },
  //     error: (error) => {
  //       console.log('Error fetching Task List ', error);
  //     },
  //   });
  // }

  // isTaskAssigned(taskId: string): boolean {
  //   return this.memberList.some(
  //     (member) => member.myTasks && member.myTasks.includes(taskId)
  //   );
  // }

  // assignTask() {
  //   const selectedMember = this.taskForm.value.selectedMember;
  //   const selectedTask = this.taskForm.value.selectedTask;

  //   // Check if the task is already assigned to a member
  //   const taskAlreadyAssigned = this.isTaskAssigned(selectedTask);

  //   if (taskAlreadyAssigned) {
  //     console.log('Task already assigned to a member');
  //     // Handle the case where the task is already assigned
  //     return;
  //   }

  //   // Call the service to assign the task
  //   this.userService
  //     .addTaskToMember(this.boardName, selectedMember, selectedTask)
  //     .subscribe(
  //       (response) => {
  //         // Update the member list after successfully assigning the task
  //         this.getListOfMembers();

  //         // Remove the assigned task from the taskList for all other members
  //         this.memberList.forEach((member) => {
  //           if (member.memberEmailId !== selectedMember) {
  //             // Ensure that myTasks is initialized before filtering
  //             member.myTasks = member.myTasks
  //               ? member.myTasks.filter(
  //                   (taskId: any) => taskId !== selectedTask
  //                 )
  //               : [];
  //           }
  //         });

  //         // Reset the form
  //         this.taskForm.reset();
  //       },
  //       (error) => {
  //         console.log('Error assigning task ', error);
  //       }
  //     );
  // }

  // goToMain() {
  //   this.route.navigate(['/user', this.boardName, 'home']);
  // }

  ngOnInit(): void {
    this.getListOfMembers();
    this.getListOfTasks();
  }
  boardName: any = '';
  memberList: any[] = [];
  spinnerActive:boolean=false;
  taskList: any[] = [];
  filteredTaskList: any[] = [];
  selectedMember: String = '';
  selectedTask: String = '';

  constructor(
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {}

  getListOfMembers() {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');

      this.userService.getMemberList(this.boardName).subscribe({
        next: (response) => {
          this.memberList = response;
          console.log('Member List fetched', response);
        },
        error: (error) => {
          console.log('Error fetching Member List ', error);
        },
      });
    });
  }

  getListOfTasks() {
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
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
    });
  }

  Submit(): void {
    this.spinnerActive=true;
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
          this.spinnerActive=false;
          snackBarRef.afterOpened().subscribe(() => {
            const snackBarContainer = document.querySelector(
              '.snackbar'
            ) as HTMLElement;
            this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
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
          let snackBarRef = this.snackBar.open(`Something went wrong !`, 'OK', {
            duration: 2000,
            // verticalPosition: 'bottom', // Set vertical position to top
            panelClass: ['snackbar'],
          });
           this.spinnerActive=false;
          snackBarRef.afterOpened().subscribe(() => {
            const snackBarContainer = document.querySelector(
              '.snackbar'
            ) as HTMLElement;
            this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
          });
        },
      });
  }

  goToMain() {
    this.route.navigate(['/user', this.boardName, 'home']);
  }
}
