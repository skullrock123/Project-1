import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  boardName:any="";
  stageList: any[] = [];

  constructor(private userService: UserService, private activeRoute: ActivatedRoute){}

  ngOnInit(){
    this.getAllStages();
  }

  getAllStages(){
    this.activeRoute.paramMap.subscribe((data) => {
      this.boardName = data.get('boardName');
    });

    this.userService.getStageList(this.boardName).subscribe(
      (response) =>{
          this.stageList = response;
          console.log(this.stageList);
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
}
