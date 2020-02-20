import { Usermodule } from './../usermodule';
import { Component, OnInit, ViewChild, PipeTransform } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
// import { Usermodule } from '../usermodule';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
// import { DecimalPipe } from '@angular/common';
// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
 

// interface user {
//     CITIZEN_ID: string;
//     TITLE: string;
//     FIRST_NAME: string;
//     LAST_NAME: string;
//     SEX: string;
//     BLOOD: string;
//     BIRTH_DATE: string;
// }
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
  dtOptions: DataTables.Settings = {};
  form: FormGroup;
  userDat: Usermodule;
  // BLOOD : [{'name':'A','code':1},{'name':'B','code':2}];
  // title = this.users;
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
   }
  ngOnInit() {
    
    this.getuserdetails()
        
      
     
// console.log(this.users);
 
  }
getuserdetails()
{
  this.dataService.getAllUsers()
  .subscribe( data => {
  this.userDat = data;
  });
 
}
onCheckboxChange(e) {
  const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }
}
submitForm() {
  console.log(this.form.value)
  this.form.value.checkArray.forEach(id => {
    console.log(id);
    this.deleteuserdetails(id);
  });
  
}
deleteuserdetails(id){
  this.dataService.removeEmployee(id)
  .subscribe( data => {
    this.userDat.id;
    // this.getuserdetails();
  })
}
updateUser(user: Usermodule): void {
  window.localStorage.removeItem("editId");
  window.localStorage.setItem("editId", user.id.toString());
  this.router.navigate(['edit']);
};
addUser(): void {
  this.router.navigate(['create']);
};
}
