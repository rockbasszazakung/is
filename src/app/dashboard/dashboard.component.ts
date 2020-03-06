import { Usermodule } from './../usermodule';
import { Component, OnInit,OnDestroy,ViewChild } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ NgbModal]
  }
)

export class DashboardComponent implements OnDestroy, OnInit {
  searchObj = {
    ConfigName: ""
    , ConfigDetailName: ""
    , Status: ""
  };
  configMasterDataModelRes:any;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  form: FormGroup;
  userDat: Usermodule;
  userMo: Usermodule;
  but :boolean;
  data:number;
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
  constructor(private modalService: NgbModal,private fb: FormBuilder,private masterdataservice: DataserviceService,private dataService: DataserviceService,private router:Router, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = undefined; 
    this.toDate = undefined;
    this.form = this.fb.group({checkArray: this.fb.array([],[])});
   }
   open(content) {
    this.modalService.open(content);
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
    this.setdtOptions();
    this.getuserdetails();
  }
  setdtOptions(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // ordering: true,
      
    columnDefs: [
      {targets: [1], searchable: !1, orderable: !1},
      {targets: [8], searchable: !1, orderable: !1},
      {targets: [9], searchable: !1, orderable: !1}
   ]
    };
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
getuserdetails()
{
  this.dataService.getAllUsers()
  .subscribe( data => {
  this.userDat = data;
  this.dtTrigger.next();
    });
  } 
onCheckboxChange(e) {
  const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
    this.but = true;
  } else {
    let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }i++;
      });
      this.but = false;
    }
  }
clear(){
  this.userMo.CITIZEN_ID = null;
  this.userMo.FIRST_NAME = null;
  this.userMo.LAST_NAME  = null;
  this.userMo.SEX        = null;
  this.userMo.BLOOD      = null;
  this.userMo.TITLE      = null;
  this.userMo.FromDate   = null;
  this.userMo.ToDate     = null;
  }
submitForm() {
  console.log(this.form.value)
  this.form.value.checkArray.forEach(id => {
    console.log(id);
    this.deleteuserdetails(id);
    });
  }
ngdestroy(){
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.postdata();
  });
}
postdata()
  { 
    let CITIZEN_ID      :any = this.userMo.CITIZEN_ID; 
    let TITLE           :any = this.userMo.TITLE;
    let FIRST_NAME      :any = this.userMo.FIRST_NAME;
    let LAST_NAME       :any = this.userMo.LAST_NAME;
    let SEX             :any = this.userMo.SEX;
    let BLOOD           :any = this.userMo.BLOOD;
    var BIRTH_DATE_START:string = this.userMo.FromDate;
    var BIRTH_DATE_END  :string = this.userMo.ToDate;
    if(CITIZEN_ID == undefined){
      CITIZEN_ID = null;
    }else{
      CITIZEN_ID = CITIZEN_ID;
    }
    if(TITLE == undefined){
      TITLE = null;
    }else{
      TITLE = TITLE;
    }
    if(FIRST_NAME == undefined){
      FIRST_NAME = null;
    }else{
      FIRST_NAME = FIRST_NAME;
    }
    if(LAST_NAME == undefined){
      LAST_NAME = null;
    }else{
      LAST_NAME = LAST_NAME;
    }
    if(SEX == undefined){
      SEX = null;
    }else{
      SEX = SEX;
    }
    if(BLOOD == undefined){
      BLOOD = null;
    }else{
      BLOOD = BLOOD;
    }
    if(BIRTH_DATE_START == undefined){
      BIRTH_DATE_START = null;
    }else{
      var BIRTH_DATE_START2 = new Date(BIRTH_DATE_START);
      let dayFromDate   = BIRTH_DATE_START2.getDate();
      let monthFromDate = BIRTH_DATE_START2.getMonth()+1;
      let yearFromDate  = BIRTH_DATE_START2.getFullYear();
      BIRTH_DATE_START  =  yearFromDate + '-' + monthFromDate + '-' +  dayFromDate;
    } 
    if(BIRTH_DATE_END == undefined){
      BIRTH_DATE_END = null;
    }else{
      var BIRTH_DATE_END2 = new Date(BIRTH_DATE_END);
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
    this.dtTrigger.next();
      })
  }
deleteuserdetails(id){
  this.dataService.removeEmployee(id)
  .subscribe( () => {
    this.userDat.id;
    location.href = "http://localhost:4200/dashboard";
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
