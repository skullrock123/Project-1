import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  MainUrl: String = 'http://localhost:8630/api/v1';
  AuthUrl: String = 'http://localhost:8630/api/v2';

  registerNewUser(userData: any): Observable<any> {
    return this.http.post(`${this.MainUrl}/save`, userData);
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post(`${this.AuthUrl}/login`, loginData, {
      responseType: 'text',
    });
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.MainUrl}/user/getAllUserDetails`);
  }

  createBoard(board: any) {
    return this.http.post(`${this.MainUrl}/user/saveBoard`, board);
  }

  addStageToBoard(boardName: any, myStages: any): Observable<any> {
    return this.http.post(
      `${this.MainUrl}/user/saveStages/${boardName}`,
      myStages
    );
  }

  addTaskToStage(task: any, stageName: any, boardName: any): Observable<any> {
    return this.http.post<any>(
      `${this.MainUrl}/user/saveTask/${boardName}/${stageName}`,
      task
    );
  }

  getStageList(boardName: any) {
    return this.http.get<any>(
      `${this.MainUrl}/user/getListOfStages/${boardName}`
    );
  }

  addMembersToBoard(boardName: any, boardMembers: any): Observable<any> {
    return this.http.post(
      `${this.MainUrl}/user/saveMembers/${boardName}`,
      boardMembers
    );
  }

  getTaskList(boardName: any): Observable<any> {
    return this.http.get(
      `${this.MainUrl}/user/getAllTasksInBoard/${boardName}`
    );
  }

  getMemberList(boardName: any): Observable<any> {
    return this.http.get(
      `${this.MainUrl}/user/getAllMembersOfBoard/${boardName}`
    );
  }

  addTaskToMember(
    boardName: String,
    memberEmailId: String,
    taskId: String
  ): Observable<any> {
    return this.http.post<any>(
      `${this.MainUrl}/user/addTaskToMember/${boardName}/${taskId}`,
      memberEmailId
    );
  }

  moveTaskToAnotherStage(
    boardName: any,
    fromStage: any,
    toStage: any,
    task: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.MainUrl}/user/transferTask/${boardName}/${fromStage}/${toStage}`,
      task
    );
  }

  getBoardList(): Observable<any> {
    return this.http.get(`${this.MainUrl}/user/getListOfBoards`);
  }

  updateTask(boardName: any, stageName: any, task: any): Observable<any> {
    return this.http.put<any>(`${this.MainUrl}/user/updateTask/${boardName}/${stageName}`, task);
  }

  deleteTask(boardName: any, stageName: any, taskId: any) {
    return this.http.delete(`${this.MainUrl}/user/deleteTask/${boardName}/${stageName}/${taskId}`);
  }

  updateUserData(userUpdatedData:any){
    return this.http.put(`${this.MainUrl}/user/updateUser`,userUpdatedData);
  }

  deleteBoard(boardName:any){
    console.log(boardName);
    
    return this.http.delete(`${this.MainUrl}/user/deleteBoard/${boardName}`);
  }

}
