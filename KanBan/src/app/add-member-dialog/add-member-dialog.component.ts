import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StageComponent } from '../home/stage/stage.component';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.css'],
})
export class AddMemberDialogComponent implements OnInit {
  board: any = '';
  boardMembers:any[] = [{ memberEmailId: '', memberName: '' }]; 
  spinnerActive: boolean = false;

  constructor(
    private userService: UserService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {boardName: any }
  ) {

  }
  ngOnInit(): void {
    this.board = this.data.boardName
  }

  isFormValid(): boolean {
    return this.boardMembers.every(
      (member) => member.memberEmailId && member.memberName
    );
  }

  addNewMember() {
    this.boardMembers.push({ memberEmailId: '', memberName: '' });
  }
 
  saveMembers() {
    this.spinnerActive = true;
    if (
      this.board.trim() !== '' &&
      this.boardMembers.map(
        (member) =>
          member.memberEmailId.trim() !== '' && member.memberName.trim() !== ''
      )
    ) {
      // Check if board is not empty and at least one stage is not empty
      console.log(this.boardMembers);
       console.log(this.board);
      this.userService
      .addMembersToBoard(this.board, this.boardMembers)
        .subscribe(
          (response) => {
           
            console.log('Members added successfully:', response);
            
            let snackBarRef = this.snackBar.open(
              'Members are added successfully...',
              'OK',
              {
                duration: 2000,
                // verticalPosition: 'bottom', // Set vertical position to top
                panelClass: ['snackbar'],
              }
            );
            this.spinnerActive = false;
            snackBarRef.afterOpened().subscribe(() => {
              const snackBarContainer = document.querySelector(
                '.snackbar'
              ) as HTMLElement;
              this.renderer.setStyle(
                snackBarContainer,
                'margin-bottom',
                '10rem'
              ); // Adjust margin as needed
              this.spinnerActive = true;
              this.dialogRef.close();
            });
            
          },
          (error) => {
            console.error('Error adding members:', error);
            let snackBarRef = this.snackBar.open(
              'Something went Wrong !',
              'OK',
              {
                duration: 2000,
                // verticalPosition: 'bottom', // Set vertical position to top
                panelClass: ['snackbar'],
              }
            );
            this.spinnerActive = false;
            snackBarRef.afterOpened().subscribe(() => {
              const snackBarContainer = document.querySelector(
                '.snackbar'
              ) as HTMLElement;
              this.renderer.setStyle(
                snackBarContainer,
                'margin-bottom',
                '10rem'
              ); 
              this.spinnerActive = true;
              this.dialogRef.close();
            });
           
          }
        );
      // Clear the board name input field and stages array
      this.board = '';
      this.boardMembers = [{ memberEmailId: '', memberName: '' }];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
