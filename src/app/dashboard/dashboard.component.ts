import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Usermodule } from '../usermodule';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
// export class TablePaginationExample implements OnInit {
//   displayedColumns: string[] = ['CITIZEN_ID', 'TITLE', 'FIRST_NAME', 'LAST_NAME','SEX','BLOOD','BIRTH_DATE'];
//   dataSource = new MatTableDataSource<PeriodicElement>();

//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//   ngOnInit() {
//     this.dataSource.paginator = this.paginator;
//   }
// }
// export interface PeriodicElement {
//   CITIZEN_ID: string;
//   TITLE: string;
//   FIRST_NAME: string;
//   LAST_NAME: string;
//   SEX: string;
//   BLOOD: string;
//   BIRTH_DATE: string;
// }
export class DashboardComponent implements OnInit {
  users: Usermodule[];
  cat:number;
 
  constructor(private dataService: DataserviceService,private router:Router) { }
 
  ngOnInit() {
    this.getuserdetails();
 
  }
  
getuserdetails()
{
  this.dataService.getAllUsers(this.cat).subscribe(response =>
    {
      this.users = response.map(item =>
      {
        return new Usermodule(
            item.CITIZEN_ID,
            item.TITLE,
            item.FIRST_NAME,
            item.LAST_NAME,
            item.SEX,
            item.BLOOD,
            item.BIRTH_DATE,
            item.id
        );
      });
    });
}
// deleteuserdetails(user:Usermodule)
// {
//   this.dataService.removeEmployee(user.CITIZEN_ID)
//   .subscribe( data => {
//     //this.users = this.users.filter(u => u !== user);
//     this.getuserdetails();
//   })
 
// }
updateUser(user: Usermodule): void {
  window.localStorage.removeItem("editId");
  window.localStorage.setItem("editId", user.id.toString());
  this.router.navigate(['edit']);
};
addUser(): void {
  this.router.navigate(['create']);
};
}
