import { Injectable, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usermodule } from './usermodule';
 
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  redirectUrl: string;
 
  baseUrl:string = "http://localhost/uat/api";
@Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient : HttpClient) { }
  public userlogin(username, password) {
    return this.httpClient.post<any>(this.baseUrl + '/login.php', { username, password })
        .pipe(map(Usermodule => {
            this.setToken(Usermodule[0].name);
            this.setName(Usermodule[0].FIRST_NAME , Usermodule[0].LAST_NAME);
            this.setUser(Usermodule[0].USER_NAME);
            this.getLoggedInName.emit(true);
            return Usermodule;
        }));
}
public userregistration(CITIZEN_ID,TITLE,FIRST_NAME,LAST_NAME,SEX,BLOOD,BIRTH_DATE,CREATE_BY ) {
  return this.httpClient.post<any>(this.baseUrl + '/registration.php', { CITIZEN_ID,TITLE,FIRST_NAME,LAST_NAME,SEX,BLOOD,BIRTH_DATE,CREATE_BY })
      .pipe(map(Usermodule => {
          return Usermodule;
      }));
}
public updateuserdetails(id,CITIZEN_ID,TITLE,FIRST_NAME,LAST_NAME,SEX,BLOOD,BIRTH_DATE,UPDATE_NAME) {
  return this.httpClient.post<any>(this.baseUrl + '/updateuser.php', { id,CITIZEN_ID,TITLE,FIRST_NAME,LAST_NAME,SEX,BLOOD,BIRTH_DATE,UPDATE_NAME })
    .pipe(map(Usermodule => {
          return Usermodule;
      }));
 
}
removeEmployee(CITIZEN_ID: number): Observable<Usermodule[]> {
  return this.httpClient.delete<Usermodule[]>(this.baseUrl+'/deletedata.php?CITIZEN_ID='+CITIZEN_ID );
}
public getUserId(id: number): Observable<Usermodule[]>
  {
    return this.httpClient.get<Usermodule[]>(
      this.baseUrl + '/getdataone.php?'+ 'id=' + id 
      );
  }
 
getAllUsers(id) : Observable<Usermodule[] > {
  return this.httpClient.get<Usermodule[]>(this.baseUrl+'/getdata.php');
}
 
//token
setToken(token: string) {
  localStorage.setItem('token', token);
}
 
getToken() {
  return localStorage.getItem('token');
}
setName(FIRST_NAME: string, LAST_NAME: string) {
  localStorage.setItem('fullname', FIRST_NAME +" "+LAST_NAME);
}
setUser(USER_NAME:string){
  localStorage.setItem('user',USER_NAME);
}
getUser(){
  localStorage.getItem('user');
}
getName() {
  return localStorage.getItem('fullname'); 
}
deleteToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('fullname'); 
}

isLoggedIn() {
  const usertoken = this.getToken();
  if (usertoken != null) {
    return true
  }
  return false;
}
 
}