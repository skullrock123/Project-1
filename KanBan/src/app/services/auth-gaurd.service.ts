import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService {

  isLogged:boolean=false
  constructor() { }

  // login(){

  //   this.isLogged=true
  // }
  // logout(){
  //   this.isLogged=false
  // }

  loginStatus(){
    if(localStorage.getItem('Token')){
      this.isLogged=true
    }
    else{
      this.isLogged=false
    }
    return this.isLogged
  }
  
}
