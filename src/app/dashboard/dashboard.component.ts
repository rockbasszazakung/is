import { Component, OnInit, ViewChild, PipeTransform } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Usermodule } from '../usermodule';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
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
  checkedList: string;
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
  form: FormGroup;
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
   }
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
// log = '';

//   logCheckbox(element: HTMLInputElement): void {
//     this.log += `Checkbox ${element.value} was ${element.checked ? '' : 'un'}checked\n`;
//     console.log(this.log);
//   }
// getCheckedItemList(){
//   this.users = [];
//   for (var i = 0; i < this.users.length; i++) {
//     if(this.users[i].isSelected)
//     this.users.push(this.users[i]);
//   }
//   this.checkedList = JSON.stringify(this.users);
// }
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
    this.users = this.users.filter(u => u !== id);
    this.getuserdetails();
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
