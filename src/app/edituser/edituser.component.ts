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
 
  angForm: FormGroup;
  submitted = false;
  userMo : Usermodule;

  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
 
    this.angForm = this.fb.group({
      id        : ['',Validators.required],
      CITIZEN_ID: ['',Validators.required],
      TITLE     : ['',Validators.required],
      FIRST_NAME: ['',Validators.required],
      LAST_NAME : ['',Validators.required],
      SEX       : ['',Validators.required],
      BLOOD     : ['',Validators.required],
      BIRTH_DATE: ['',Validators.required],
      // UPDATE_NAME:['',Validators.required]
 
    });
   }

   get f() { return this.angForm.controls; }

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
    // console.log("wow")angForm1.value.UPDATE_NAME,
    console.log(this.userMo)
    let  UPDATE_NAME = localStorage.getItem('user'); 
    this.userMo.UPDATE_NAME = UPDATE_NAME;
    this.dataService.updateuserdetails(this.userMo)
    .pipe(first())
    .subscribe(
        () => {
            // this.router.navigate(['dashboard']);
        },
        () => {
        });
  }
}