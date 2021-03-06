import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import {Usermodule} from '../usermodule';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css'],
  providers: [
  ]
})
export class CreateuserComponent implements OnInit {
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
  BLOOD = [
    {id: 1, name: 'เอ'},
    {id: 2, name: 'บี'},
    {id: 3, name: 'เอบี'},
    {id: 4, name: 'โอ'},
  ];

  SEX = [
    {id:1, name: 'ชาย'},
    {id:2, name: 'หญิง'}
  ];

  TITLE = [
    {id:1,name:'นาย'},
    {id:2,name:'นาง'},
    {id:3,name:'นางสาว'}
  ]
  constructor(private dataService: DataserviceService,private router:Router) {
  }
  onReset() {
    this.submitted = false;
    this.angForm.reset();
}
  ngOnInit() {
    this.userMo = new Usermodule();
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
      && this.FIRST_NAME_Validators == false && this.LAST_NAME_Validators == false && this.BLOOD_Validators == false
      && this.BIRTH_DATE_Validators == false ){
          this.HBD();
          this.CREATE_BY();
          this.dataService.userregistration(this.userMo)
            .pipe(first())
            .subscribe(
                () => {
                  alert("เพิ่มข้อมูลสำเร็จ");
                  this.router.navigate(['dashboard']);
          },
          () => {
                  alert("เพิ่มข้อมูลสำเร็จ");
                  this.router.navigate(['dashboard']);
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
      this.CITIZEN_ID_Validators_value ="ท่านกรอกเลขบัตรประชาชนน้อยกว่า13ตัว";
    } 
    else if(this.userMo.CITIZEN_ID.length >13){
      console.log(this.userMo.CITIZEN_ID.length);
      this.CITIZEN_ID_Validators = true;
      this.CITIZEN_ID_Validators_value ="ท่านกรอกเลขบัตรประชาชนมากกว่า13ตัว";
    }
    else if(this.userMo.CITIZEN_ID.length == 13){
      let p_iPID = this.userMo.CITIZEN_ID;
      var total = 0;
      var iPID;
      var chk;
      var Validchk;
      iPID = p_iPID.replace(/-/g, "");
      Validchk = iPID.substr(12, 1);
      var j = 0;
      var pidcut;
      for (var n = 0; n < 12; n++) {
          pidcut = parseInt(iPID.substr(j, 1));
          total = (total + ((pidcut) * (13 - n)));
          j++;
      }
      chk = 11 - (total % 11);
      if (chk == 10) {
          chk = 0;
      } else if (chk == 11) {
          chk = 1;
      }
      if (chk == Validchk) {
        this.CITIZEN_ID_Validators = false;
      } else {
        this.CITIZEN_ID_Validators = true;
        this.CITIZEN_ID_Validators_value ="กรุณากรองเลขบัตรประชาชนให้ถูกต้อง";
      }
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
    let hbd = this.userMo.BIRTH_DATE;
    var hbd2 = new Date(hbd);
    console.log("dataa",hbd2);
    // console.log("เดิม",this.userMo.BIRTH_DATE)
    var day = hbd2.getDate();
    let month =(hbd2.getMonth()+1);
    let year = hbd2.getFullYear();
    this.userMo.BIRTH_DATE = year + '-' + month + '-' +  day;
    console.log("ใหม่",this.userMo.BIRTH_DATE);
  }
  CREATE_BY(){
    let  CREATE_BY = localStorage.getItem('user');
    this.userMo.CREATE_BY = CREATE_BY;
  }
}