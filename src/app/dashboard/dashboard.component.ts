import { Component, OnInit, ViewChild, PipeTransform } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Usermodule } from '../usermodule';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
 

interface user {
    CITIZEN_ID: string;
    TITLE: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    SEX: string;
    BLOOD: string;
    BIRTH_DATE: string;
}
// function search(text: string, pipe: PipeTransform): user[] {
//   return Usermodule.filter(user => {
//     const term = text.toLowerCase();
//     return user.CITIZEN_ID.toLowerCase().includes(term)
//         || pipe.transform(user.TITLE).includes(term)
//         || pipe.transform(user.FIRST_NAME).includes(term)
//         || pipe.transform(user.LAST_NAME).includes(term)
//         || pipe.transform(user.SEX).includes(term)
//         || pipe.transform(user.BIRTH_DATE).includes(term)
//         || pipe.transform(user.BLOOD).includes(term);
//   });
// }
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  users: Usermodule[];
  cat:number;

  page = 1;
  pageSize = 4;
  collectionSize = Usermodule.length;

  get countries(): user[] {
    return Usermodule
      .map((user, i) => ({id: i + 1, ...user}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  // countries$: Observable<user[]>;
  // filter = new FormControl('');

  // constructor(pipe: DecimalPipe) {
  //   this.countries$ = this.filter.valueChanges.pipe(
  //     startWith(''),
  //     map(text => search(text, pipe))
  //   );
  // }

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
