import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import {Usermodule} from '../usermodule';
import {
  NgbDateAdapter,
  NgbDateStruct,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day : parseInt(date[2], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[0], 10)
      };
    }
    return result;
  }
  toModel(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      result = date.year + this.DELIMITER + date.month + this.DELIMITER + date.day;
    }
    return result;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      result = date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
    }
    return result;
  }
}
@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EdituserComponent implements OnInit {
  // boolean
  CITIZEN_ID_Validators:boolean;
  TITLE_Validators:boolean;
  SEX_Validators:boolean;
  FIRST_NAME_Validators:boolean;
  LAST_NAME_Validators:boolean;
  BLOOD_Validators:boolean;
  BIRTH_DATE_Validators:boolean;
  // string
  CITIZEN_ID_Validators_value:string;
  TITLE_Validators_value:string;
  SEX_Validators_value:string;
  FIRST_NAME_Validators_value:string;
  LAST_NAME_Validators_value:string;
  BLOOD_Validators_value:string;
  BIRTH_DATE_Validators_value:string;

  angForm: FormGroup;
  submitted = false;
  userMo : Usermodule;
 
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
  }
   onReset() {
    this.submitted = false;
    this.angForm.reset();
}
  ngOnInit() {
    let id = window.localStorage.getItem("editId");
    
    this.getuserprofilebyid(id);
  
  }
  getuserprofilebyid(id){
    this.dataService.getUserId(id)
    .subscribe( data => {
    this.userMo = data;
    console.log('test userMo :',this.userMo); 
    });
  }

  postdata()
  {
    this.Validators_CITIZEN_ID();
    this.Validators_TITLE();
    this.Validators_SEX();
    this.Validators_FIRST_NAME();
    this.Validators_LAST_NAME();
    this.Validators_BLOOD();
    this.Validators_BIRTH_DATE();
    if(this.CITIZEN_ID_Validators == false && this.TITLE_Validators == false && this.SEX_Validators == false
      && this.FIRST_NAME_Validators == false && this.LAST_NAME_Validators == false && this.BLOOD_Validators==false
      && this.BIRTH_DATE_Validators == false ){
          console.log("wow wow");
          this.HBD();
          this.UPDATE_NAME(); 
          this.dataService.updateuserdetails(this.userMo)
          .pipe(first())
          .subscribe(
              () => {
                this.router.navigate(['dashboard']);
              },
              () => {
              });
    }
  }
  Validators_CITIZEN_ID(){
    if(this.userMo.CITIZEN_ID == undefined ||this.userMo.CITIZEN_ID == ''){
      this.CITIZEN_ID_Validators = true;
      this.CITIZEN_ID_Validators_value ="กรุณากรอกเลขบัตรประชาชน";
    }
    else if(this.userMo.CITIZEN_ID.length <13){
      console.log(this.userMo.CITIZEN_ID.length);
      this.CITIZEN_ID_Validators = true;
      this.CITIZEN_ID_Validators_value ="กรอกเลขบัตรประชาชนน้อยกว่า13ตัว";
    } 
    else if(this.userMo.CITIZEN_ID.length >13){
      console.log(this.userMo.CITIZEN_ID.length);
      this.CITIZEN_ID_Validators = true;
      this.CITIZEN_ID_Validators_value ="กรอกเลขบัตรประชาชนให้มากกว่า13ตัว";
    }
    else{
      this.CITIZEN_ID_Validators = false;
    }
  }
  Validators_TITLE(){
    if(this.userMo.TITLE == undefined || this.userMo.TITLE == ''){
      this.TITLE_Validators = true;
      this.TITLE_Validators_value = "กรุณาเลือกคำนำหน้าชื่อ"
    }else{
      this.TITLE_Validators = false;
    }
  }
  Validators_SEX(){
    if(this.userMo.SEX == undefined || this.userMo.SEX == ''){
      this.SEX_Validators = true;
      this.SEX_Validators_value = "กรุณาเลือกเพศ"
    }else{
      this.SEX_Validators = false;
    }
  }
  Validators_FIRST_NAME(){
    if(this.userMo.FIRST_NAME == undefined || this.userMo.FIRST_NAME == ''){
      this.FIRST_NAME_Validators = true;
      this.FIRST_NAME_Validators_value = "กรุณากรอกชื่อตัวไทย"
    }else{
      this.FIRST_NAME_Validators = false;
    }
  }
  Validators_LAST_NAME(){
    if(this.userMo.LAST_NAME == undefined || this.userMo.LAST_NAME == ''){
      this.LAST_NAME_Validators = true;
      this.LAST_NAME_Validators_value = "กรุณากรอกชื่อสกุลไทย"
    }else{
      this.LAST_NAME_Validators = false;
    }
  }
  Validators_BLOOD(){
    if(this.userMo.BLOOD == undefined || this.userMo.BLOOD == ''){
      this.BLOOD_Validators = true;
      this.BLOOD_Validators_value = "กรุณาเลือกหมู่โลหิต"
    }else{
      this.BLOOD_Validators = false;
    }
  }
  Validators_BIRTH_DATE(){
    if(this.userMo.BIRTH_DATE == undefined || this.userMo.BIRTH_DATE == ''){
      this.BIRTH_DATE_Validators = true;
      this.BIRTH_DATE_Validators_value = "กรุณาเลือกวันเกิด"
    }else{
      this.BIRTH_DATE_Validators = false;
    }
  }
  HBD(){
    console.log("เดิม",this.userMo.BIRTH_DATE)
    let day = this.userMo.BIRTH_DATE.getDate();
    let month =(this.userMo.BIRTH_DATE.getMonth()+1);
    let year = this.userMo.BIRTH_DATE.getFullYear();
    this.userMo.BIRTH_DATE = year + '/' + month + '/' +  day;
    console.log("ใหม่",this.userMo.BIRTH_DATE);
  }
  UPDATE_NAME(){
    let  UPDATE_NAME = localStorage.getItem('user'); 
    this.userMo.UPDATE_NAME = UPDATE_NAME;
  }
}    
