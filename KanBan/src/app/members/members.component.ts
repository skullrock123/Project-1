import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  board: any = '';
  boardMembers: any[] = [{ memberEmailId: '', memberName: '' }]; // Initial stages
  spinnerActive:boolean=false;
  
  constructor(
    private userService: UserService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((data) => {
      this.board = data.get('boardName');
    });
  }

  isFormValid(): boolean {
    return this.boardMembers.every(member => member.memberEmailId && member.memberName);
}

  addNewMember() {
    this.boardMembers.push({ memberEmailId: '', memberName: '' });
  }
  removeNewMember(itemIntex: number) {
    this.boardMembers.splice(itemIntex, 1);
  }
  saveMembers() {
    this.spinnerActive=true;
    if (
      this.board.trim() !== '' &&
      this.boardMembers.map(
        (member) =>
          member.memberEmailId.trim() !== '' && member.memberName.trim() !== ''
      )
    ) {
      // Check if board is not empty and at least one stage is not empty
      console.log(this.boardMembers);
      this.userService
        .addMembersToBoard(this.board, this.boardMembers)
        .subscribe(
          (response) => {
            this.activeRoute.paramMap.subscribe((data) => {
              this.board = data.get('boardName');
            });
            console.log('Members added successfully:', response);
            console.log(this.board);
            let snackBarRef = this.snackBar.open(
              'Members are added successfully...',
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
              this.renderer.setStyle(
                snackBarContainer,
                'margin-bottom',
                '10rem'
              ); // Adjust margin as needed
            });
            snackBarRef.afterDismissed().subscribe(() => {
              this.route.navigate(['/user', this.board, 'saveStages']);
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
            this.spinnerActive=false;
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
            // Handle errors as needed
          }
        );
      // Clear the board name input field and stages array
      this.board = '';
      this.boardMembers = [{ memberEmailId: '', memberName: '' }];
    }
  }

  // board: any = '';
  // boardMembers: any[] = [{ memberEmailId: '', memberName: '' }]; // Initial stages
  // memberForm!: FormGroup; // Declare the form group

  // constructor(
  //   private userService: UserService,
  //   private route: Router,
  //   private activeRoute: ActivatedRoute,
  //   private fb: FormBuilder // Inject the form builder service
  // ) {}

  // ngOnInit(): void {
  //   this.activeRoute.paramMap.subscribe((data) => {
  //     this.board = data.get('boardName');
  //   });
  //   this.memberForm = this.fb.group({
  //     // Create the form group using the form builder
  //     memberEmailId: ['', [Validators.required, Validators.email]], // Add validators to the form control
  //     memberName: ['', Validators.required],
  //   });
  // }

  // addNewMember() {
  //   this.boardMembers.push({ memberEmailId: '', memberName: '' });
  // }

  // removeNewMember(itemIntex: number) {
  //   this.boardMembers.splice(itemIntex, 1);
  // }
  // saveMembers() {
  //   if (this.memberForm.valid) {
  //     // Check if the form is valid
  //     console.log(this.boardMembers);
  //     this.userService
  //       .addMembersToBoard(this.board, this.boardMembers)
  //       .subscribe(
  //         (response) => {
  //           this.activeRoute.paramMap.subscribe((data) => {
  //             this.board = data.get('boardName');
  //           });
  //           console.log('Members added successfully:', response);
  //           console.log(this.board);

  //           this.route.navigate(['/user', this.board, 'saveStages']);
  //         },
  //         (error) => {
  //           console.error('Error adding members:', error);
  //           // Handle errors as needed
  //         }
  //       );

  //     // Clear the board name input field and stages array
  //     this.board = '';
  //     this.boardMembers = [{ memberEmailId: '', memberName: '' }];
  //   }
  // }
}
