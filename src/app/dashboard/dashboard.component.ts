import { Usermodule } from './../usermodule';
import { Component, OnInit,OnDestroy} from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs';
// import { Person } from '../person';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  }
)

export class DashboardComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  form: FormGroup;
  userDat: Usermodule;
  userMo: Usermodule;
  data:number;
  // FromDate:string;
  // ToDate:string;
  BLOOD = [
    {id: 1, name: 'เอ'},
    {id: 2, name: 'บี'},
    {id: 3, name: 'เอบี'},
    {id: 4, name: 'โอ'},
  ];
  SEX = [
    {id:'M', name: 'ชาย'},
    {id:'F', name: 'หญิง'}
  ];
  TITLE = [
    {id:1,name:'นาย'},
    {id:2,name:'นาง'},
    {id:3,name:'นางสาว'}
  ]
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  BIRTH_DATE_START: string;

  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = undefined; 
    this.toDate = undefined;
    this.form = this.fb.group({checkArray: this.fb.array([],[])});
   }
   onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  ngOnInit() {
    this.userMo = new Usermodule();
    this.getValueWithAsync();
    this.getuserdetails();
  }
getuserdetails()
{
  this.dataService.getAllUsers()
  .subscribe( data => {
  this.userDat = data;
    });
  } 
  async getValueWithAsync() {
    const value = <any>await this.dataService.getAllUsers();
    console.log("async result",value);
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
clear(){
  this.userMo.CITIZEN_ID = undefined;
  this.userMo.FIRST_NAME = undefined;
  this.userMo.LAST_NAME  = undefined;
  this.userMo.SEX        = undefined;
  this.userMo.BLOOD      = undefined;
  this.userMo.TITLE      = undefined;
  this.userMo.FromDate   = undefined;
  this.userMo.ToDate     = undefined;
  }
submitForm() {
  console.log(this.form.value)
  this.form.value.checkArray.forEach(id => {
    console.log(id);
    this.deleteuserdetails(id);
    });
  }
postdata()
  { 
    console.log(this.userMo)
    let CITIZEN_ID      :any = this.userMo.CITIZEN_ID; 
    let TITLE           :any = this.userMo.TITLE;
    let FIRST_NAME      :any = this.userMo.FIRST_NAME;
    let LAST_NAME       :any = this.userMo.LAST_NAME;
    let SEX             :any = this.userMo.SEX;
    let BLOOD           :any = this.userMo.BLOOD;
    var BIRTH_DATE_START:string = this.userMo.FromDate;
    var BIRTH_DATE_END  :string = this.userMo.ToDate;
    if(BIRTH_DATE_START == undefined){
      BIRTH_DATE_START = undefined;
    }else{
      var BIRTH_DATE_START2 = new Date(BIRTH_DATE_START);
      let dayFromDate   = BIRTH_DATE_START2.getDate();
      let monthFromDate = BIRTH_DATE_START2.getMonth()+1;
      let yearFromDate  = BIRTH_DATE_START2.getFullYear();
      this.BIRTH_DATE_START  =  yearFromDate + '-' + monthFromDate + '-' +  dayFromDate;
    } 
    if(BIRTH_DATE_END == undefined){
      BIRTH_DATE_END = undefined;
    }else{
      var BIRTH_DATE_END2 = new Date(BIRTH_DATE_START);
      let dayToDate   = BIRTH_DATE_END2.getDate();
      let monthToDate = BIRTH_DATE_END2.getMonth()+1;
      let yearToDate  = BIRTH_DATE_END2.getFullYear();
      BIRTH_DATE_END  =  yearToDate + '-' + monthToDate + '-' +  dayToDate;
    }
    console.log("ต้น", BIRTH_DATE_START);
    console.log("หลัง",BIRTH_DATE_END);
    this.dataService.searchAll(CITIZEN_ID,TITLE,FIRST_NAME,LAST_NAME,SEX,BLOOD,BIRTH_DATE_START,BIRTH_DATE_END)
  .subscribe( data => {
    this.userDat = data;
    })
  }
deleteuserdetails(id){
  this.dataService.removeEmployee(id)
  .subscribe( () => {
    this.userDat.id;
    this.router.navigate(['create']);
    },
    () => {
    this.router.navigate(['dashboard']);
    });
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
