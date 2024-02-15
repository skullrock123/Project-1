import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../model/User';
import { FileHandle } from '../model/file-handle.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  // user: User = {
  //   emailId: '',
  //   password: '',
  //   username: '',
  //   profession: '',
  //   userImage: {
  //     file: new File([], ''),
  //     url: this.sanitizer.bypassSecurityTrustUrl(''),
  //   },
  // };

  // ngOnInit(): void {}

  // constructor(
  //   private userService: UserService,
  //   private sanitizer: DomSanitizer,
  //   private route: Router
  // ) {}

  // addNewUser() {

  //   const userFormData = this.prepareFormData(this.user);
  //   this.userService.registerNewUser(userFormData).subscribe(
  //     (success) => {
  //       console.log(success);
  //       alert('user registration success...');
  //       this.route.navigateByUrl('/login')
  //     },
  //     (error) => {
  //       console.log(error);
  //       alert('user registration failed...');
  //     }
  //   );
  // }

  // prepareFormData(user: User): FormData {
  //   const formData = new FormData();
  //   formData.append(
  //     'user',
  //     new Blob([JSON.stringify(user)], { type: 'application/json' })
  //   );
  //   formData.append('imageFile', user.userImage.file, user.userImage.file.name);
  //   return formData;
  // }

  // onFileSelected(event: any) {
  //   console.log(event.target.files);

  //   if (event.target.files) {
  //     const file = event.target.files[0];
  //     console.log(file);

  //     const fileHandle: FileHandle = {
  //       file: file,
  //       url: this.sanitizer.bypassSecurityTrustUrl(
  //         window.URL.createObjectURL(file)
  //       ),
  //     };

  //     this.user.userImage = fileHandle;
  //   }
  // }
  userForm!: FormGroup;
  spinnerActive:boolean=false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private route: Router,
    private _snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      profession: ['', Validators.required],
      userImage: [
        {
          file: new File([], 'userLogo.png'),
          url: this.sanitizer.bypassSecurityTrustUrl(
            'assets/images/userLogo.png'
          ),
        },
      ],
    });
  }

  addNewUser() {
    if (this.userForm.valid) {
      console.log(this.userForm.value.userImage);
      // if (this.userForm.value.userImage == null) {
      //   this.userForm.value.userImage = {
      //     file: new File([], 'userLogo'),
      //     url: this.sanitizer.bypassSecurityTrustUrl(
      //       'blob:http://localhost:4200/6683e578-b750-4c32-8caa-aa63b47b771d'
      //     ),
      //   };
      // }
      const userFormData = this.prepareFormData(this.userForm.value);
      this.spinnerActive=true;

      this.userService.registerNewUser(userFormData).subscribe(
        (success) => {
          console.log(success);
          console.log(success.username);

          let snackBarRef = this._snackBar.open(
            `User ${success.username} has successfully registred !!!`,
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

          snackBarRef.afterDismissed().subscribe(() => {
            this.route.navigateByUrl('/login');
          });
        },
        (error) => {
          console.log(error);
          let snackBarRef = this._snackBar.open(
            'Something went wrong !',
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
          this.spinnerActive=false;
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  prepareFormData(formData: any): FormData {
    const user = {
      emailId: formData.emailId,
      password: formData.password,
      username: formData.username,
      profession: formData.profession,
      userImage: {
        file: formData.userImage.file,
        url: this.sanitizer.bypassSecurityTrustUrl(formData.userImage.url),
      },
    };

    const formDataObj = new FormData();
    formDataObj.append(
      'user',
      new Blob([JSON.stringify(user)], { type: 'application/json' })
    );
    formDataObj.append(
      'imageFile',
      user.userImage.file,
      user.userImage.file.name
    );

    return formDataObj;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.userForm.patchValue({ userImage: fileHandle });
    }
  }
}
