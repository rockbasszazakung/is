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
public userregistration(userMo:Usermodule) {
  var data = JSON.stringify(userMo);
  return this.httpClient.post<any>(this.baseUrl + '/registration.php', data)
      .pipe(map(Usermodule => {
          return Usermodule;
      }));
}
public updateuserdetails(userMo:Usermodule) {
  var data = JSON.stringify(userMo);
  return this.httpClient.post<any>(this.baseUrl + '/updateuser.php', data)
    .pipe(map(Usermodule => {
          return Usermodule;
      }));
 
}
public searchAll(CITIZEN_ID:any,TITLE:any,FIRST_NAME:any,LAST_NAME:any,SEX:any,BLOOD:any,BIRTH_DATE_START:string,BIRTH_DATE_END:string):Observable<Usermodule> {

    return this.httpClient.get<Usermodule>(this.baseUrl+'/searchAll2.php?CITIZEN_ID='
    +CITIZEN_ID+'&TITLE='+TITLE+'&FIRST_NAME='+FIRST_NAME+'&LAST_NAME='+LAST_NAME+'&SEX='+SEX+'&BLOOD='+BLOOD+
    '&BIRTH_DATE_START='+BIRTH_DATE_START+'&BIRTH_DATE_END='+BIRTH_DATE_END);
  } 
removeEmployee(id: number): Observable<Usermodule> {
  return this.httpClient.delete<Usermodule>(this.baseUrl+'/deletedata.php?id='+id );
}
public getUserId(id: number): Observable<Usermodule>
  {
    return this.httpClient.get<Usermodule>(this.baseUrl + '/getdataone.php?'+ 'id=' + id );
  }

getAllUsers() : Observable<Usermodule> {
  return this.httpClient.get<Usermodule>(this.baseUrl+'/getdata.php');
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