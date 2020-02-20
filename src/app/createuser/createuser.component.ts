import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import {Usermodule} from '../usermodule';
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
  submitted = false;
  userMo : Usermodule;
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
 
    this.angForm = this.fb.group({
      CITIZEN_ID: ['',[Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      TITLE     : ['',Validators.required],
      FIRST_NAME: ['',Validators.required],
      LAST_NAME : ['',Validators.required],
      SEX       : ['',Validators.required],
      BLOOD     : ['',Validators.required],
      BIRTH_DATE: ['',Validators.required]
    }); 
   }
  get f() { return this.angForm.controls; }
  onReset() {
    this.submitted = false;
    this.angForm.reset();
}
  ngOnInit() {
    this.userMo = new Usermodule();
    console.log(this.userMo);
   }
  
  postdata()
  {
    
    console.log(this.userMo);
    let  CREATE_BY = localStorage.getItem('user');
    this.userMo.CREATE_BY = CREATE_BY;
    this.dataService.userregistration(this.userMo)
      .pipe(first())
      .subscribe(
          data => {
            this.router.navigate(['dashboard']);
            
            
          },
          error => {
            console.log(this.userMo);
            // console.log(angForm1.value.BIRTH_DATE);
            console.log(CREATE_BY);
          });
  }
  // get CITIZEN_ID() { return this.angForm.get('CITIZEN_ID'); }
  // get TITLE()      { return this.angForm.get('TITLE');      }
  // get FIRST_NAME() { return this.angForm.get('FIRST_NAME'); }
  // get LAST_NAME()  { return this.angForm.get('LAST_NAME');  }
  // get SEX()        { return this.angForm.get('SEX');        }
  // get BLOOD()      { return this.angForm.get('BLOOD');      }
  // get BIRTH_DATE() { return this.angForm.get('BIRTH_DATE'); }
  // get CREATE_BY()  { return this.angForm.get('CREATE_BY');  }
  
}