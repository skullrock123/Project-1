import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing.component';
import { BoardComponent } from './board/board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UserAuthInterceptor } from './security/user-auth.interceptor';
import { StagesComponent } from './stages/stages.component';
import { MembersComponent } from './members/members.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddTaskToMemberComponent } from './add-task-to-member/add-task-to-member.component';
import { HomeComponent } from './home/home.component';
import { StageComponent } from './home/stage/stage.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { NavComponent } from './nav/nav.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

// materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';





// cdk's
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotFoundComponent } from './not-found/not-found.component';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { AssignTaskDialogComponent } from './assign-task-dialog/assign-task-dialog.component';







@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BoardComponent,
    SignupComponent,
    LoginComponent,
    StagesComponent,
    MembersComponent,
    AddTaskComponent,
    AddTaskToMemberComponent,
    HomeComponent,
    StageComponent,
    UpdateUserComponent,
    NavigationComponent,
    FooterComponent,
    UpdateTaskComponent,
    NavComponent,
    TaskDetailsComponent,
    NotFoundComponent,
    AddTaskDialogComponent,
    AddMemberDialogComponent,
    AssignTaskDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    DragDropModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
