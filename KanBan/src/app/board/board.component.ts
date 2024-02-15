import { Component, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  showInput: boolean = false;
  boardName: string = '';
  spinnerActive:boolean=false;

  constructor(
    private userService: UserService,
    private route: Router,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {}

  createBoard(): void {
    if (this.boardName) {
      const board = { boardName: this.boardName };
      console.log(board);
      this.spinnerActive=true;

      this.userService.createBoard(board).subscribe(
        (response) => {
          console.log('Board created successfully:', response);
          console.log(board.boardName);
          let snackBarRef = this.snackBar.open(
            `${board.boardName} is successfully Created...`,
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
          // this.router.navigate(['/user/board']);
          snackBarRef.afterDismissed().subscribe(() => {
            this.route.navigate(['/user', board.boardName, 'saveMembers']);
          });

          // You can add more logic or update UI based on the response
        },
        (error) => {
          console.error('Error creating board:', error);
          let snackBarRef = this.snackBar.open(
            `Error creating ${board.boardName} !`,
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
          // Handle errors appropriately
        }
      );

      this.boardName = '';
      this.showInput = false;
    } else {
      console.log('Please enter a board name.');
    }
  }
}
