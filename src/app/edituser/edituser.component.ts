import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
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
   getUser(){
    let UPDATE_NAME = localStorage.getItem('user');
    return UPDATE_NAME;
   }
 
  ngOnInit() {
    
    let id = window.localStorage.getItem("editId");
    if(!id) {
      this.router.navigate(['list-user']);
      return;
    }
    this.dataService.getUserId(+id)
      .subscribe( data => {
        // this.UPDATE_NAME;
        // let  UPDATE_NAME = localStorage.getItem('user'); ;
       // this.angForm.controls[email].setValue('name')
       // this.email.nativeElement.value = 'This is new value';
        this.angForm.patchValue({
          id:data[0].id,CITIZEN_ID:data[0].CITIZEN_ID,TITLE: data[0].TITLE, FIRST_NAME: data[0].FIRST_NAME, LAST_NAME: data[0].LAST_NAME, SEX: data[0].SEX, BLOOD: data[0].BLOOD, BIRTH_DATE:data[0].BIRTH_DATE
        });
      });
  }
  
  postdata(angForm1:NgForm)
  {
    // console.log("wow")angForm1.value.UPDATE_NAME,
    let  UPDATE_NAME = localStorage.getItem('user'); ;
    console.log(UPDATE_NAME);
    this.dataService.updateuserdetails(angForm1.value.id,angForm1.value.CITIZEN_ID, angForm1.value.TITLE,angForm1.value.FIRST_NAME,angForm1.value.LAST_NAME,angForm1.value.SEX,angForm1.value.BLOOD,angForm1.value.BIRTH_DATE,UPDATE_NAME)
    .pipe(first())
    .subscribe(
        () => {
            this.router.navigate(['dashboard']);
            console.log(angForm1.value.CITIZEN_ID);
            console.log(angForm1.value.UPDATE_NAME);
        },
        () => {
        });
        console.log(angForm1.value.CITIZEN_ID);
        // console.log("wow"+localStorage.getItem('user'));
        console.log(UPDATE_NAME);
  }
  get id()          {return this.angForm.get('id');         }
  get CITIZEN_ID() { return this.angForm.get('CITIZEN_ID'); }
  get TITLE()      { return this.angForm.get('TITLE');      }
  get FIRST_NAME() { return this.angForm.get('FIRST_NAME'); }
  get LAST_NAME()  { return this.angForm.get('LAST_NAME');  }
  get SEX()        { return this.angForm.get('SEX');        }
  get BLOOD()      { return this.angForm.get('BLOOD');      }
  get BIRTH_DATE() { return this.angForm.get('BIRTH_DATE'); }
  get UPDATE_NAME(){ return this.angForm.get('UPDATE_NAME');}
}