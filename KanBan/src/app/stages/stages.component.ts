import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'],
})
export class StagesComponent implements OnInit {
  hasError: boolean | undefined;
  board: any = '';
  myStages: any[] = [
    { stageName: 'Todo' },
    { stageName: 'InProgress' },
    { stageName: 'Completed' },
  ]; // Initial stages

  constructor(
    private userService: UserService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private renderer:Renderer2
  ) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((data) => {
      this.board = data.get('boardName');
    });
    this.hasError = false;
  }

  addNewStage() {
    this.myStages.push({ stageName: '' });
  }

  removeNewStage(indexValue: number) {
    this.myStages.splice(indexValue, 1);
  }

  areStagesValid(): boolean {
    // Check if any stageName is empty
    return this.myStages.every((stage) => stage.stageName.trim() !== '');
  }

  addStages(): void {
    // Add your logic to save stages if they are valid
    if (this.areStagesValid()) {
      // Your saving logic here
      if (
        this.board.trim() !== '' &&
        this.myStages.map((stage) => stage.stageName.trim() !== '')
      ) {
        // Check if board is not empty and at least one stage is not empty
        console.log(this.myStages);
        this.userService.addStageToBoard(this.board, this.myStages).subscribe(
          (response) => {
            this.activeRoute.paramMap.subscribe((data) => {
              this.board = data.get('boardName');
            });
            console.log('Stage added successfully:', response);
            let responseList: any[] = response;
            console.log(responseList[0].stageName);

            let snackBarRef = this.snackBar.open(
              'Board Stages are added successfully...',
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
              this.route.navigate([
                '/user',
                this.board,
                responseList[0].stageName,
                'addTask',
              ]);
            });

            
          },
          (error) => {
            console.error('Error adding stage:', error);
            // Handle errors as needed
            let snackBarRef = this.snackBar.open(
              'Something went Wrong !',
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

        // Clear the board name input field and stages array
        this.board = '';
        this.myStages = [{ stageName: '' }];
      }
    } else {
      // Show an error message or handle the case where stages are not valid
      this.hasError = true;
      console.log("inside else");
      
    }
  }
}
