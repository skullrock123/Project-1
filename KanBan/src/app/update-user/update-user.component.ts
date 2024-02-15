import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { ImageProcessingService } from '../services/image-processing.service';
import { map } from 'rxjs';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  userData: any;
  userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private imageService: ImageProcessingService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      profession: ['', Validators.required],
    });
    this.getAllUserData();
    this.getUserAllBoards();
  }

  getAllUserData() {
    this.userService
      .getUserData()
      .pipe(map((user: any) => this.imageService.createImages(user)))
      .subscribe((response) => {
        console.log(response);
        this.userData = response;
        this.userForm.patchValue(this.userData);
      });
  }

  updateUser() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.userService.updateUserData(this.userForm.value).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          let snackBarRef = this._snackBar.open(
            `User Data Updated Successfully !!!`,
            'OK',
            {
              duration: 3000,
              panelClass: ['snackbar'],
            }
          );

          snackBarRef.afterOpened().subscribe(() => {
            const snackBarContainer = document.querySelector(
              '.snackbar'
            ) as HTMLElement;
            this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
          });
        },
        (error) => {
          console.error('Error updating user:', error);
          let snackBarRef = this._snackBar.open(
            `User Data is Not Updated , Something went Wrong !!!`,
            'OK',
            {
              duration: 3000,
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

  boardList: any[] = [];
  selectedBoardName = '';
  boardMemberList: any[] = [];
  selectedBoardMember = '';
  memberTaskList: any[] = [];
  emptyList: any[] = [];
  isShowMember!: boolean;
  isShowTask!: boolean;
  getUserAllBoards() {
    this.userService.getBoardList().subscribe((response) => {
      console.log(response);
      this.boardList = response;
    });
  }

  getMemberListOfSelectedBoard(selectedBoardName: string) {
    console.log(selectedBoardName);
    this.userService.getMemberList(selectedBoardName).subscribe((response) => {
      console.log(response);
      this.boardMemberList = response;
    });
  }

  getAllTaskOfMember(selectMember: any) {
    this.memberTaskList = selectMember.myTask;
  }

  onBoardSelectionChange(event: any) {
    console.log(event);

    // Get the selected chip
    let chip = event;
    // Check if it is selected or not
    if (chip.selected == true) {
      // If selected, get the board name and assign it to the selected board property
      this.selectedBoardName = chip.source._value;
      this.isShowMember = true;
      // Call the method to get the member list of the selected board
      // this.getMemberListOfSelectedBoard(this.selectedBoardName);
    } else {
      // If deselected, clear the selected board property and the board member list
      this.isShowMember = false;
      this.selectedBoardName = '';
      this.boardMemberList = this.emptyList;
    }
  }

  // Add a method to handle the selection change of the member list
  onMemberSelectionChange(event: any) {
    // Get the selected chip
    let chip = event;
    // Check if it is selected or not
    if (chip.selected) {
      this.isShowTask = true;
      // If selected, get the member object and assign it to the selected board member property
      this.selectedBoardMember = chip.source._value;
      // this.getAllTaskOfMember(this.selectedBoardMember);
    } else {
      this.isShowTask = false;
      this.selectedBoardMember = '';
      this.memberTaskList = this.emptyList;
    }
  }

  deleteBoard() {
    console.log(this.selectedBoardName);
    let deleteConfirm = confirm('Do you want to delete this board ?');
    if (deleteConfirm) {
      this.userService
        .deleteBoard(this.selectedBoardName)
        .subscribe((response) => {
          console.log(response);
        });

         this.route
           .navigateByUrl('/', { skipLocationChange: true })
           .then(() => {
             this.route.navigate(['/user/updateUser']);
           });
    }

   
  }

  addNewMember() {
    console.log(this.selectedBoardName);
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '500px',
      data: { boardName: this.selectedBoardName },
    });
    
    
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed, if needed
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate(['/user/updateUser']);
      });
    });
  }

  deleteMember() {
    console.log(this.selectedBoardMember);
  }
}
