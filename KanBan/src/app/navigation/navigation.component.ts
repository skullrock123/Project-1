import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthGaurdService } from '../services/auth-gaurd.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  userName:string="";
  ngOnInit(): void {
    this.getAllBoards();
    this.getUser();
  }
  boardList: any[] = [];

  constructor(
    private userService: UserService,
    private route: Router,
    private authService: AuthGaurdService
  ) {}
  getAllBoards() {
    this.userService.getBoardList().subscribe({
      next: (data) => {
        this.boardList = data;
        console.log('Board List:', data);
      },
      error: (error) => {
        console.log('Error fetching Board List', error);
      },
    });
  }

  onLoggingOut() {
    let confirmvalue = confirm('Are you sure , Do you want to Logout ?');
    if (confirmvalue) {
      localStorage.removeItem('Token');
      this.authService.loginStatus();
      this.route.navigateByUrl('/login');
    }
  }

  redirectToboard(boardName: any) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate(['/user', boardName, 'home']);
    });
  }


  getUser()
  {
     this.userService.getUserData().subscribe({
      next:(data)=>{
      this.userName=data.username;

      },
      error:(error)=>{

      }
     })
  }
}
