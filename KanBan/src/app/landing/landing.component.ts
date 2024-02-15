import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  scrollDown(){
    let dEle = document.getElementById('downPage');
    dEle?.scrollIntoView({behavior:'smooth'})
  }
}
