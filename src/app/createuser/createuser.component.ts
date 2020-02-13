import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import {
  NgbCalendar,
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
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CreateuserComponent implements OnInit {

  angForm: FormGroup;
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
 
    this.angForm = this.fb.group({
      CITIZEN_ID: ['',Validators.required],
      TITLE     : ['',Validators.required],
      FIRST_NAME: ['',Validators.required],
      LAST_NAME : ['',Validators.required],
      SEX       : ['',Validators.required],
      BLOOD     : ['',Validators.required],
      BIRTH_DATE: ['',Validators.required]
    });
   }
  //  getUser(){
  //   let CREATE_BY = localStorage.getItem('user');
  //   return CREATE_BY;
  //  }
 
  ngOnInit() {
  }
  postdata(angForm1:NgForm)
  {
    let  CREATE_BY = localStorage.getItem('user');
    // console.log(CREATE_BY); 
    this.dataService.userregistration(angForm1.value.CITIZEN_ID, angForm1.value.TITLE,angForm1.value.FIRST_NAME,angForm1.value.LAST_NAME,angForm1.value.SEX,angForm1.value.BLOOD,angForm1.value.BIRTH_DATE,CREATE_BY)
      .pipe(first())
      .subscribe(
          data => {
            
            console.log(angForm1.value.BIRTH_DATE);
            
          },
          error => {
            this.router.navigate(['dashboard']);
            console.log(angForm1.value.BIRTH_DATE);
            console.log(CREATE_BY);
          });
  }
  get CITIZEN_ID() { return this.angForm.get('CITIZEN_ID'); }
  get TITLE()      { return this.angForm.get('TITLE');      }
  get FIRST_NAME() { return this.angForm.get('FIRST_NAME'); }
  get LAST_NAME()  { return this.angForm.get('LAST_NAME');  }
  get SEX()        { return this.angForm.get('SEX');        }
  get BLOOD()      { return this.angForm.get('BLOOD');      }
  get BIRTH_DATE() { return this.angForm.get('BIRTH_DATE'); }
  get CREATE_BY()  { return this.angForm.get('CREATE_BY');  }
  
}