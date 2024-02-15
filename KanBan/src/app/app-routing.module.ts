import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { BoardComponent } from './board/board.component';
import { StagesComponent } from './stages/stages.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { MembersComponent } from './members/members.component';
import { AddTaskToMemberComponent } from './add-task-to-member/add-task-to-member.component';
import { HomeComponent } from './home/home.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/board', component: BoardComponent, canActivate: [authGuard] },
  {
    path: 'user/:boardName/saveMembers',
    component: MembersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:boardName/saveStages',
    component: StagesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:boardName/:stageName/addTask',
    component: AddTaskComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:boardName/assignTask',
    component: AddTaskToMemberComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:boardName/home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/updateUser',
    component: UpdateUserComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
