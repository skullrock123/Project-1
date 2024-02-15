import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGaurdService } from '../services/auth-gaurd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private authService:AuthGaurdService
  ) {}
  
  spinnerActive:boolean=false;

  loginform = new FormGroup({
    emailId: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  tokenGet: any;
  userLogin() {
    this.spinnerActive=true;
    let loginData = {
      emailId: this.loginform.get('emailId')?.value,
      password: this.loginform.get('password')?.value,
    };
    this.userService.loginUser(loginData).subscribe(
      (succes) => {
        console.log(succes);
        localStorage.setItem('Token', succes);
        let snackBarRef = this.snackBar.open(
          'You have successfully loggedIn..',
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
          this.spinnerActive=false;
        });
      
        // this.router.navigate(['/user/board']);
        snackBarRef.afterDismissed().subscribe(() => {
          this.authService.loginStatus()
          this.router.navigate(['/user/board']);
        });
      },
      (error) => {
        console.log(error);
        let snackBarRef = this.snackBar.open('Somthing went wrong !', 'OK', {
          duration: 2000,
          // verticalPosition: 'bottom', // Set vertical position to top
          panelClass: ['snackbar'],
        });

        snackBarRef.afterOpened().subscribe(() => {
          const snackBarContainer = document.querySelector(
            '.snackbar'
          ) as HTMLElement;
          this.renderer.setStyle(snackBarContainer, 'margin-bottom', '10rem'); // Adjust margin as needed
          this.spinnerActive=false;
        });
      }
    );
  }
}
