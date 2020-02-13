import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  angForm: FormGroup;
  constructor(private fb: FormBuilder,private dataService: DataserviceService,private router:Router) {
    this.angForm = this.fb.group({
 
      username: ['', [Validators.required,Validators.minLength(1)]],
      password: ['', Validators.required]
 
    });
   }
 
  ngOnInit() {
  }
  postdata(angForm1:NgForm)
  {
    this.dataService.userlogin(angForm1.value.username,angForm1.value.password)
      .pipe(first())
      .subscribe(
          data => {
                const redirect = this.dataService.redirectUrl ? this.dataService.redirectUrl : '/dashboard';
                this.router.navigate([redirect]);
 
          },
          error => {
              alert("User name or password is incorrect")
          });
  }
  get username() { return this.angForm.get('username'); }
  get password() { return this.angForm.get('password'); }
}